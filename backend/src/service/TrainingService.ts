import { Repository, MongoRepository } from "typeorm";
import { Authentication_Request, SURGERY_TYPE } from "../utils/dataTypes.js";
import { User } from "../entity/sql/User.js";
import { Role } from "../entity/sql/Roles.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { AuthenticationRequest } from "../entity/sql/AuthenticationRequests.js";
import { surgeryRepo } from "../config/repositories.js";
import { EligibilityResult, TrainingProgress } from "../utils/dataTypes.js";

export class TrainingService {
	constructor(
		private userRepo: Repository<User>,
		private roleRepo: Repository<Role>,
		private surgeryLogRepo: MongoRepository<SurgeryLog>,
		private authRequestRepo: Repository<AuthenticationRequest>
	) {}

	async getTrainingProgress(userId: string): Promise<TrainingProgress> {
		const [user, role] = await Promise.all([
			this.userRepo.findOne({
				where: { id: userId },
				relations: ["role"],
			}),
			this.roleRepo.findOne({
				where: { users: { id: userId } },
			}),
		]);

		if (!user || !role) {
			throw new Error("User or role not found");
		}

		const requiredType = role.requiredSurgeryType;
		const requiredCount = role.requiredCount;

		if (!requiredType || requiredCount === 0) {
			return {
				completed: 0,
				required: 0,
				remaining: 0,
				met: true,
				type: null,
			};
		}

		const completedSurgeries = await this.surgeryLogRepo.count({
			where: {
				"trainingCredits.userId": userId,
				"trainingCredits.verified": true,
				surgeryType: requiredType,
			},
		});

		return {
			completed: completedSurgeries,
			required: requiredCount,
			remaining: Math.max(requiredCount - completedSurgeries, 0),
			met: completedSurgeries >= requiredCount,
			type: requiredType,
		};
	}

	async recordSurgeryCredit(
		userId: string,
		surgeryId: number,
		roleId: number
	): Promise<void> {
		const [user, role, surgeryLog] = await Promise.all([
			this.userRepo.findOneBy({ id: userId }),
			this.roleRepo.findOneBy({ id: roleId }),
			this.surgeryLogRepo.findOneBy({ surgeryId }),
		]);

		if (!user) throw Error("User Not Found");

		if (!surgeryLog?.trainingCredits) {
			throw new Error("Surgery not found or invalid training credits");
		}

		const credit = surgeryLog.trainingCredits.find(
			(tc) => tc.userId === userId && tc.roleId === roleId
		);

		if (!credit?.verified) {
			throw new Error("Unverified surgical participation");
		}

		const surgery = await surgeryRepo.findOne({
			where: { id: surgeryId },
		});

		if (role.requiredSurgeryType !== surgery?.SurgeryType) {
			throw new Error("Surgery type doesn't match role requirements");
		}
	}

	async checkEligibility(
		userId: string,
		targetRoleId: number
	): Promise<EligibilityResult> {
		const [currentRole, targetRole] = await Promise.all([
			this.roleRepo.findOne({
				where: { users: { id: userId } },
			}),
			this.roleRepo.findOneBy({ id: targetRoleId }),
		]);

		if (!currentRole || !targetRole) {
			throw new Error("Roles not found");
		}

		const validTransition = this.validateRoleTransition(
			currentRole,
			targetRole
		);
		if (!validTransition) {
			return {
				eligible: false,
				required: 0,
				completed: 0,
				remaining: 0,
				met: false,
				type: null,
				reason: "Invalid role progression hierarchy",
			};
		}

		const progress = await this.getTrainingProgress(userId);
		if (!progress.met) {
			return {
				eligible: false,
				required: progress.required,
				completed: progress.completed,
				remaining: progress.remaining,
				met: progress.met,
				type: progress.type,
				reason: `Need ${progress.remaining} more ${progress.type} surgeries`,
			};
		}

		return {
			eligible: true,
			required: progress.required,
			completed: progress.completed,
			remaining: 0,
			met: true,
			type: progress.type,
			reason: "",
		};
	}

	validateRoleTransition(currentRole: Role, targetRole: Role): boolean {
		const validTransitions = {
			[Role.INTERN]: [Role.RESIDENT],
			[Role.RESIDENT]: [Role.SPECIALIST],
			[Role.SPECIALIST]: [Role.CONSULTANT],
			[Role.CONSULTANT]: [Role.DEPARTMENT_HEAD],
		};

		return (
			validTransitions[currentRole.name]?.includes(targetRole.name) ?? false
		);
	}

	async handleSurgeryCompletion(surgeryId: number): Promise<void> {
		const surgery = await this.surgeryLogRepo.findOneBy({ surgeryId });

		if (!surgery?.trainingCredits) {
			throw new Error("Invalid surgery record");
		}

		await Promise.all(
			surgery.trainingCredits.map(async (credit) => {
				if (credit.verified) {
					await this.recordSurgeryCredit(
						credit.userId,
						surgeryId,
						credit.roleId
					);
				}
			})
		);

		await this.authRequestRepo.update(
			{ surgery: { id: surgeryId } },
			{ status: Authentication_Request.APPROVED }
		);
	}

	async getRequiredSurgeries(roleId: number): Promise<{
		type: SURGERY_TYPE;
		count: number;
		description: string;
	}> {
		const role = await this.roleRepo.findOneBy({ id: roleId });

		if (!role) {
			throw new Error("Role not found");
		}

		return {
			type: role.requiredSurgeryType,
			count: role.requiredCount,
			description: this.getRequirementDescription(role.name),
		};
	}

	private getRequirementDescription(roleName: string): string {
		const descriptions = {
			[Role.INTERN]: "20+ observed procedures under supervision",
			[Role.RESIDENT]: "150+ supervised surgeries",
			[Role.SPECIALIST]: "100+ specialized procedures",
			[Role.CONSULTANT]: "50+ complex surgeries as lead",
		};

		return descriptions[roleName] || "No specific surgery requirements";
	}

	async initializeSurgeryRecords(
		surgeryId: number,
		participants: Array<{ userId: string; roleId: number }>
	) {
		const surgeryLog = await this.surgeryLogRepo.findOneBy({ surgeryId });
		if (!surgeryLog) return;

		surgeryLog.trainingCredits = participants.map((p) => ({
			userId: p.userId,
			roleId: p.roleId,
			verified: false,
			verifiedBy: null,
			verifiedAt: null,
		}));

		await this.surgeryLogRepo.save(surgeryLog);
	}

	async removeSurgeryRecords(surgeryId: number) {
		await this.surgeryLogRepo.update({ surgeryId }, { trainingCredits: [] });
	}
}
