import jwt from "jsonwebtoken";
import { JWTPayload, STATUS } from "../utils/dataTypes.js";
import { User } from "../entity/sql/User.js";
import { surgeryLogsRepo, surgeryRepo } from "../config/repositories.js";
import { ObjectId } from "mongodb";

const secretKey = process.env.JWT_SECRET;

interface SurgeryInterface {
	id: string;
	name: string;
	date: Date;
	status: STATUS;
	stars: number;
	icdCode: string;
	cptCode: string;
	patient_id: ObjectId;
}

const jwtHandler = (payload: JWTPayload): string => {
	const token: string = jwt.sign(payload, secretKey, {
		expiresIn: "30d",
	});

	return token;
};

export const createJWTtoken = async (
	user: User,
	firstLogin: boolean
): Promise<{ token: string; formatedSurgeries: SurgeryInterface[] }> => {
	const surgeries = await surgeryLogsRepo.find({
		where: {
			$or: [{ "doctorsTeam.doctorId": user.id }, { leadSurgeon: user.id }],
		},
	});
	const permissions = user.role?.permissions?.map((perm) => perm.action) || null;

	let names: Promise<string>[];
	if (surgeries.length > 0) {
		names = surgeries.map(async (sur) => {
			const surgeriesName = await surgeryRepo.findOne({
				where: {
					id: sur.surgeryId,
				},
				select: ["name", "id"],
			});
			return surgeriesName.name;
		});
	}
	const resolvedNames = surgeries.length > 0 ? await Promise.all(names) : [];
	const formatedSurgeries: SurgeryInterface[] = surgeries.map(
		(surgery, index) => ({
			id: surgery.id.toString(),
			name: resolvedNames[index],
			date: surgery.date,
			status: surgery.status,
			stars: surgery.stars,
			icdCode: surgery.icdCode,
			cptCode: surgery.cptCode,
			patient_id: new ObjectId(surgery.patient_details.patient_id),
		})
	);

	const jwtPayload: JWTPayload = {
		id: user.id,
		userRole: user.role?.name || null,
		permissions,
		picture: user.picture,
		name: `${user.first_name} ${user.last_name}`,
		tokenVersion: user.token_version,
		first_login: firstLogin,
	};

	const token = jwtHandler(jwtPayload);

	return { token, formatedSurgeries };
};
