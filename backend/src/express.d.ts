import { User } from "./entity/sql/User.js";

declare module "express-serve-static-core" {
	interface Request {
		user?: Partial<User>;
	}
}
