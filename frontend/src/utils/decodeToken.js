import * as jose from "jose";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

export async function decodeJWTToken(token) {
	try {
		if (!token) throw new Error("No token provided");
		const secret = new TextEncoder().encode(SECRET_KEY);
		const { payload } = await jose.jwtVerify(token, secret);
		return payload;
	} catch (error) {
		console.log(error);
		throw Error("Error in authentication");
	}
}
