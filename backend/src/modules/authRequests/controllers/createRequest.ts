import { Request, Response } from "express";
import {
	authenticationRequestRepo,
	roleRepo,
	surgeryLogsRepo,
	surgeryRepo,
	userRepo,
} from "../../../config/repositories.js";
import { AuthenticationRequest } from "../../../entity/sql/AuthenticationRequests.js";
import {
	Authentication_Request,
	NOTIFICATION_TYPES,
} from "../../../utils/dataTypes.js";
import { NotificationService } from "../../../service/NotificationService.js";
import { createRequestSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { DoctorsTeam } from "../../../entity/sub entity/DoctorsTeam.js";

export const createRequest = async (req: Request, res: Response) => {
	const validation = createRequestSchema.safeParse(req.body);

	if (!validation.success)
		throw Error(formatErrorMessage(validation), { cause: validation.error });

	const { surgeryId, traineeId, consultantId, roleId, permissions, notes } =
		validation.data;

	const parsedSurgeryId = parseInt(surgeryId, 10);
	const parsedRoleId = parseInt(roleId, 10);

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

	const consultantRole = await roleRepo.findOneBy({ name: "Consultant" });

	if (!consultantRole)
		throw Error("Consultant role is not defined in the system.");

	const consultant = await userRepo.findOneBy({
		id: consultantId,
		role: consultantRole,
	});

	if (!consultant) throw Error("Invalid Consultant data");

	const role = await roleRepo.findOneBy({ id: parsedRoleId });

	if (!role) throw Error("Invalid role");

	const existingRequest = await authenticationRequestRepo.findOne({
		where: {
			surgery: { id: parsedSurgeryId },
			trainee: { id: traineeId },
			consultant: { id: consultantId },
			status: Authentication_Request.PENDING,
		},
	});
	if (existingRequest) {
		res.status(409).json({
			success: false,
			message:
				"An authentication request is already pending for this trainee in the specified surgery.",
		});
		return;
	}

	const authRequest = new AuthenticationRequest();
	authRequest.surgery = surgery;
	authRequest.trainee = trainee;
	authRequest.consultant = consultant;
	authRequest.role = role;
	authRequest.status = Authentication_Request.PENDING;

	const parsedPermissions = permissions.map((perm) => parseInt(perm));
	const doctor = new DoctorsTeam(
		traineeId,
		role.id,
		parsedPermissions,
		null,
		notes
	);

	const surgeryLog = await surgeryLogsRepo.findOneBy({
		surgeryId: parsedSurgeryId,
	});

	surgeryLog.doctorsTeam.push(doctor);
	const notificationService = new NotificationService();

	await Promise.all([
		authenticationRequestRepo.save(authRequest),
		surgeryLogsRepo.save(surgeryLog),
		notificationService.createNotification(
			consultant.id,
			NOTIFICATION_TYPES.AUTH_REQUEST,
			`You have a new request from DR.${trainee.first_name} ${trainee.last_name} \nfor surgery: ${surgery.surgery_type.name}`
		),
	]);

	res.status(201).json({
		success: true,
		message: "Request has been sent",
	});
};
