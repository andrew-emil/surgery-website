import { MailtrapTransport } from "mailtrap";
import Nodemailer from 'nodemailer'

// export const transporter = nodemailer.createTransport({
// 	host: "live.smtp.mailtrap.io",
// 	port: 587,
// 	secure: false,
// 	auth: {
// 		user: "api",
// 		pass: process.env.NODEMAILER_PASS as string,
// 	},
// });

const token = process.env.NODEMAILER_TOKEN as string;

export const mail = Nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 587,
	auth: {
		user: "91bdff6957ea0e",
		pass: "e9181d06f3d6a7",
	},
});

export const sender = {
	address: "andrewemil343@example.com",
	name: "Mailtrap Test",
};