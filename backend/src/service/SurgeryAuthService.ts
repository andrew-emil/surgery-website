import { MongoRepository, Repository } from "typeorm";
import { authenticationRequestRepo, roleRepo } from "../config/repositories.js";
import { Authentication_Request } from "../utils/dataTypes.js";
import { TrainingService } from "./TrainingService.js";
import { AuthenticationRequest } from "../entity/sql/AuthenticationRequests.js";
import { SurgeryLog } from "../entity/mongodb/SurgeryLog.js";
import { Surgery } from "../entity/sql/Surgery.js";

export class SurgeryAuthService {
	constructor(
		private trainingService: TrainingService,
		private authRequestRepo: Repository<AuthenticationRequest>,
		private surgeryLogRepo: MongoRepository<SurgeryLog>,
		private surgeryRepo: Repository<Surgery>
	) {}

	async handleRequestApproval(requestId: number) {
		const request = await authenticationRequestRepo.findOne({
			where: { id: requestId },
			relations: ["trainee", "requestRole", "surgery", "consultant"],
		});

		if (!request || request.status !== Authentication_Request.PENDING)
			throw Error("Invalid or non-pending request");

		try {
			const eligibility = await this.trainingService.checkEligibility(
				request.trainee.id,
				request.requestedRole.id
			);
			if (!eligibility.eligible) {
				await this.rejectRequest(request, eligibility.reason);
				return;
			}

			const surgery = await this.surgeryRepo.findOne({
				where: { id: request.surgery.id },
			});

			if (surgery?.SurgeryType !== request.requestedRole.requiredSurgeryType) {
				await this.rejectRequest(
					request,
					`Surgery type ${surgery?.SurgeryType} doesn't match role requirement ${request.requestedRole.requiredSurgeryType}`
				);
				return;
			}

			await this.updateSurgeryParticipation(
				request.surgery.id,
				request.trainee.id,
				request.requestedRole.id,
				request.consultant.id
			);

			request.status = Authentication_Request.APPROVED;
			request.approvedAt = new Date();
			await this.authRequestRepo.save(request);
		} catch (error) {
			await this.rejectRequest(request, `Approval failed: ${error.message}`);
			throw error;
		}
	}

	private async updateSurgeryParticipation(
		surgeryId: number,
		userId: string,
		roleId: number,
		consultantId: string
	) {
		const surgeryLog = await this.surgeryLogRepo.findOneBy({ surgeryId });

		if (!surgeryLog) throw Error("Surgery log Not Found");

		await this.surgeryLogRepo.updateOne(
			{ surgeryId },
			{
				$push: {
					trainingCredits: {
						userId,
						roleId,
						verified: true,
						verifiedBy: consultantId,
						verifiedAt: new Date(),
					} as never,
				},
			}
		);

		await this.trainingService.recordSurgeryCredit(userId, surgeryId, roleId);
	}

	async rejectRequest(request: AuthenticationRequest, reason: string) {
		request.status = Authentication_Request.CANCELLED;
		request.rejectionReason = reason.substring(0, 255);
		await this.authRequestRepo.save(request);
	}
}
