import jwt from "jsonwebtoken";
import { JWTPayload} from "../utils/dataTypes.js";
import { User } from "../entity/sql/User.js";

const secretKey = process.env.JWT_SECRET;

const jwtHandler = (payload: JWTPayload): string => {
	const token: string = jwt.sign(payload, secretKey, {
		expiresIn: "30d",
	});

	return token;
};

export const createJWTtoken = async (
	user: User,
	firstLogin: boolean
): Promise<string> => {
	const permissions = user.role.permissions?.map((perm) => perm.action) || null;

	const jwtPayload: JWTPayload = {
		id: user.id,
		userRole: user.role?.name || null,
		permissions,
		name: `${user.first_name} ${user.last_name}`,
		tokenVersion: user.token_version,
		first_login: firstLogin,
	};

	const token = jwtHandler(jwtPayload);

	return token;
};
