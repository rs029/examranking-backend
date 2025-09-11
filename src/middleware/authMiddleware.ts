import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    user? : any //attach user info to request object
}

export const authenticationToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader =  req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //Bearer TOKEN
}