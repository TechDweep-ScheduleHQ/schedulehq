import { Request , Response , NextFunction } from "express";
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request{
    user?: {userId : number}
}

export const authentication = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try{
        const authHeaders = req.headers["authorization"];

        if(!authHeaders || !authHeaders.startsWith("Bearer ")){
            return res.status(401).json({status:false,message:"No token provided!"})
        }

        const token = authHeaders.split(" ")[1];
        if(!token){
            return res.status(401).json({status:false,message:"Token is missing!"})
        }

        const secret = process.env.JWT_SECRET;
        if(!secret){
            throw new Error("Jwt Secret not configured in environment!")
        }

        const decoded = jwt.verify(token,secret) as {userId : number};
        req.user = decoded;
        // console.log(decoded,"decoded")
        next();
    }
    catch(error:any){
        console.error("Auth error",error.message);
        return res.status(500).json({status:false,message:"Invalid or expired token!"})
    }
}

