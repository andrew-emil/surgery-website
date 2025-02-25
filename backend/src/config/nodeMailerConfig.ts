import { MailtrapTransport } from "mailtrap";
import nodeMailer from "nodemailer";

export const mail = nodeMailer.createTransport(
	MailtrapTransport({
		token: process.env.NODEMAILER_TOKEN,
		testInboxId: 3479614,
	})
);

export const sender = {
	address: "andrewemil343@example.com",
	name: "Mailtrap Test",
};
