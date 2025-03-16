import { In } from "typeorm";
import { trainingService } from "../config/initializeServices.js";
import { DoctorsTeam } from "../entity/sub entity/DoctorsTeam.js";
import { roleRepo, userRepo } from "../config/repositories.js";

export const getEnhancedTeamDetails = async (participants: DoctorsTeam[]) => {
	const doctorIds = participants.map((p) => p.doctorId);
	const roleIds = participants.map((p) => p.roleId);

	const [users, roles] = await Promise.all([
		userRepo.find({
			where: { id: In(doctorIds) },
			select: ["id", "first_name", "last_name", "email", "role"],
		}),
		roleRepo.findBy({ id: In(roleIds) }),
	]);

	return Promise.all(
		participants.map(async (participant) => {
			const user = users.find((u) => u.id === participant.doctorId);
			const role = roles.find((r) => r.id === participant.roleId);

			console.log(user, role)

			const trainingProgress = await trainingService.getTrainingProgress(
				user.id
			);

			return {
				id: participant.doctorId,
				name: user ? `${user.first_name} ${user.last_name}` : "Unknown",
				email: user?.email || "N/A",
				hospitalRole: user?.role?.name || "N/A",
				surgicalRole: role?.name || "N/A",
				permissions: participant.permissions,
				trainingProgress: {
					required: trainingProgress.required,
					completed: trainingProgress.completed,
					progress: `${trainingProgress.completed}/${trainingProgress.required}`,
				},
			};
		})
	);
};
