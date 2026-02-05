import { uploadToIPFS , calculateFileHash} from "../services/ipfs";
import { medicalContract } from "../services/blockchain";
import db from "db/db.js";

export const reportController={
    submitMedicalReport:async(req,res)=>{
        try {
            if(!req.file){
                return res.status(400).json({message:"No file uploaded"})
            }
            
        } catch (error) {
            
        }
    }
}