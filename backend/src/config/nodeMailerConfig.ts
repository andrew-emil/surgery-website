import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "live.smtp.mailtrap.io",
	port: 587,
	secure: false,
	auth: {
		user: "api",
		pass: process.env.NODEMAILER_PASS as string,
	},
});
