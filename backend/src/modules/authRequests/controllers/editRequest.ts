import { Request, Response } from "express";
import { editRequestSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import {
	authenticationRequestRepo,
	roleRepo,
	surgeryLogsRepo,
	surgeryRepo,
	userRepo,
} from "../../../config/repositories.js";

export const editRequest = async (req: Request, res: Response) => {
	const validation = editRequestSchema.safeParse(req.body);

	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { surgeryId, traineeId, roleId, permissions, notes } = validation.data;
	const parsedSurgeryId = parseInt(surgeryId);

	const surgery = await surgeryRepo.findOne({
		where: {
			id: parsedSurgeryId,
		},
		relations: ["surgery_type"],
	});
	if (!surgery) throw Error("Surgery not Found");

	const trainee = await userRepo.findOneBy({
		id: traineeId,
	});
	if (!trainee) throw Error("Invalid user data");

	const authRequest = await authenticationRequestRepo.findOne({
		where: {
			surgery: { id: parsedSurgeryId },
			trainee: { id: traineeId },
		},
	});
	if (!authRequest) throw Error("Request Not Found");

	if (roleId) {
		const parsedRoleId = parseInt(roleId);
		const role = await roleRepo.findOneBy({ id: parsedRoleId });
		if (!role) throw Error("Role Not Found");

		authRequest.role = role;
	}

	if (permissions || typeof notes !== "undefined") {
		const surgeryLog = await surgeryLogsRepo.findOneBy({
			surgeryId: parsedSurgeryId,
		});
		if (!surgeryLog) throw Error("Surgery log Not Found");

		const doctorEntry = surgeryLog.doctorsTeam.find(
			(doctor) => doctor.doctorId === traineeId
		);
		if (!doctorEntry) throw Error("Doctor Not Found in surgery log");

		if (permissions) {
			const parsedPermissions = permissions.map((perm: string | number) =>
				parseInt(perm.toString(), 10)
			);
			doctorEntry.permissions = parsedPermissions;
		}

		if (typeof notes !== "undefined") doctorEntry.notes = notes;

		if (roleId) doctorEntry.roleId = authRequest.role.id;

		await Promise.all([
			authenticationRequestRepo.save(authRequest),
			surgeryLogsRepo.update(
				{ surgeryId: surgeryLog.surgeryId },
				{ doctorsTeam: surgeryLog.doctorsTeam }
			),
		]);
	} else {
		await authenticationRequestRepo.save(authRequest);
	}

	res.status(200).json({
		success: true,
		message: "Request updated successfully",
	});
};
