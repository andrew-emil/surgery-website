// import { transporter } from "../config/nodeMailerConfig.js";
import {
	ACCOUNT_UPDATE_TEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	ACCOUNT_APPROVED_TEMPLATE,
	ACCOUNT_REJECTED_TEMPLATE,
} from "./emailTemplate.js";
import { mail, sender } from "../config/nodeMailerConfig.js";
import logger from "../config/loggerConfig.js";

const senderEmail = process.env.SENDER_EMAILS;

export const sendVerificationEmails = async (to: string, otp: string) => {
	try {
		//await transporter.sendMail({
		// 	from: senderEmail,
		// 	to,
		// 	subject: "Verify your email",
		// 	html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
		// });

		await mail.sendMail({
			from: sender,
			to,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
			// sandbox: true,
		});
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};

export const sendResetEmail = async (to: string, resetLink: string) => {
	try {
		// await transporter.sendMail({
		// 	from: senderEmail,
		// 	to,
		// 	subject: "Reset password request",
		// 	html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink),
		// });

		await mail.sendMail({
			from: sender,
			to,
			subject: "Reset password request",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink),
			// sandbox: true,
		});
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};

export const sendAccountUpdateEmail = async (
	to: string,
	updatedFields: Partial<{
		firstName: string;
		lastName: string;
		email: string;
		phoneNumber: string;
	}>
) => {
	try {
		let emailContent = ACCOUNT_UPDATE_TEMPLATE;

		if (updatedFields.firstName) {
			emailContent = emailContent.replace(
				"{{firstName}}",
				updatedFields.firstName
			);
		}
		if (updatedFields.lastName) {
			emailContent = emailContent.replace(
				"{{lastName}}",
				updatedFields.lastName
			);
		}
		if (updatedFields.email) {
			emailContent = emailContent.replace("{{email}}", updatedFields.email);
		}
		if (updatedFields.phoneNumber) {
			emailContent = emailContent.replace(
				"{{phoneNumber}}",
				updatedFields.phoneNumber
			);
		}

		emailContent = emailContent.replace(/{{\w+}}/g, "Not updated");

		// await transporter.sendMail({
		// 	from: senderEmail,
		// 	to,
		// 	subject: "Your Account Has Been Updated",
		// 	html: emailContent,
		// });

		await mail.sendMail({
			from: sender,
			to,
			subject: "Your Account Has Been Updated",
			html: emailContent,
			// sandbox: true,
		});
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};

export const sendAccountApprovalEmails = async (to: string) => {
	try {
		// await transporter.sendMail({
		// 	from: senderEmail,
		// 	to,
		// 	subject: "Your Account Has Been Approved",
		// 	html: ACCOUNT_APPROVED_TEMPLATE.replace(
		// 		"{loginUrl}",
		// 		`${process.env.BASE_URL}/login`
		// 	),
		// });
		await mail.sendMail({
			from: sender,
			to,
			subject: "Your Account Has Been Approved",
			html: ACCOUNT_APPROVED_TEMPLATE.replace(
				"{loginUrl}",
				`${process.env.BASE_URL}/login`
			),
			// sandbox: true,
		});
	} catch (error) {
		logger.error("Error sending account update email:", error);
		throw Error(error.message);
	}
};

export const sendAccountRejectionEmails = async (
	to: string,
	rejectionReason: string
) => {
	try {
		// await transporter.sendMail({
		// 	from: senderEmail,
		// 	to,
		// 	subject: "Your Account Has Been Rejected",
		// 	html: ACCOUNT_REJECTED_TEMPLATE.replace(
		// 		"{rejectionReason}",
		// 		rejectionReason
		// 	),
		// });
		await mail.sendMail({
			from: sender,
			to,
			subject: "Your Account Has Been Rejected",
			html: ACCOUNT_REJECTED_TEMPLATE.replace(
				"{rejectionReason}",
				rejectionReason
			),
			// sandbox: true,
		});
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};
