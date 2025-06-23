import { transporter } from "../config/nodeMailerConfig.js";
import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
	ACCOUNT_APPROVED_TEMPLATE,
	ACCOUNT_REJECTED_TEMPLATE,
} from "./emailTemplate.js";
import logger from "../config/loggerConfig.js";

const senderEmail = process.env.SENDER_EMAILS;

export const sendVerificationEmails = async (to: string, otp: string) => {
	try {
		await transporter.sendMail({
			from: senderEmail,
			to,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", otp),
		});

		
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};

export const sendResetEmail = async (to: string, resetLink: string) => {
	try {
		await transporter.sendMail({
			from: senderEmail,
			to,
			subject: "Reset password request",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink),
		});

		
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};



export const sendAccountApprovalEmails = async (to: string) => {
	try {
		await transporter.sendMail({
			from: senderEmail,
			to,
			subject: "Your Account Has Been Approved",
			html: ACCOUNT_APPROVED_TEMPLATE.replace(
				"{loginUrl}",
				`${process.env.BASE_URL}/login`
			),
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
		await transporter.sendMail({
			from: senderEmail,
			to,
			subject: "Your Account Has Been Rejected",
			html: ACCOUNT_REJECTED_TEMPLATE.replace(
				"{rejectionReason}",
				rejectionReason
			),
		});
		
	} catch (error) {
		logger.error("Error sending email: ", error);
		throw Error(error.message);
	}
};
