import { Request, Response } from "express";
import {
	postSurgeryRepo,
	surgeryLogsRepo,
} from "../../../config/repositories.js";
import { exportLogSchema } from "../../../utils/zodSchemas.js";
import { formatErrorMessage } from "../../../utils/formatErrorMessage.js";
import { json2csv } from "json-2-csv";
import {
	excelFormat,
	pdfFormat,
	transformLog,
} from "../../../utils/exportLogHelperFunction.js";
import { validateSchema } from "../../../utils/validateSchema.js";

const availableFormats = ["csv", "pdf", "excel"];

export const exportLog = async (req: Request, res: Response) => {
	const { format, startDate, endDate } = validateSchema(
		exportLogSchema,
		req.query
	);

	if (!availableFormats.includes(format)) {
		throw Error(
			`Invalid format. Allowed values are ${availableFormats.join(", ")}`
		);
	}

	const start = new Date(startDate);
	const end = new Date(endDate);

	const [logs, posts] = await Promise.all([
		surgeryLogsRepo.find({
			where: {
				createdAt: { $gte: start, $lte: end },
			},
		}),
		postSurgeryRepo.find({
			where: {
				createdAt: { $gte: start, $lte: end },
			},
		}),
	]);

	if (logs.length === 0) {
		res.status(404).json({
			success: false,
			message: "No logs found for the specified date range.",
		});
		return;
	}

	const data = await Promise.all(logs.map((log) => transformLog(log, posts)));

	if (format === "csv") {
		const csv = json2csv(data, {
			arrayIndexesAsKeys: true,
		});
		res.header("Content-Type", "text/csv").attachment("report.csv").send(csv);
		return;
	}

	if (format === "pdf") {
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader("Content-Disposition", "attachment; filename=Report.pdf");
		const doc = pdfFormat(res, data);

		doc.end();
		return;
	}

	if (format === "excel") await excelFormat(res, data);
};
