import { Request, Response } from "express";

export const addSurgery = async (req: Request, res: Response) => {
	const {
		hospitalId,
		surgeryTypeId,
		performedBy,
		date,
		time,
		surgicalTimeMinutes,
		cptCode,
		icdCode,
		patientBmi,
		patientComorbidity,
		patientDiagnosis,
	} = req.body;

    
};
