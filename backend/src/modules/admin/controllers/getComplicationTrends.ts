import { Request, Response } from "express";
import { postSurgeryRepo } from "../../../config/repositories.js";

export const getComplicationTrends = async (req:Request, res:Response) => {
    const logs = await postSurgeryRepo.find()
    const trends: Record<string, number> = {}

    logs.forEach(log => {
        if(log.complications && log.complications.trim() !== ""){
            
        }
    })

}