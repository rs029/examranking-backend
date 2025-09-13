import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
    user? : any //attach user info to request object
}

export const authenticationToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader =  req.headers['authorization']
    const token = authHeader?.split(' ')[1] //token can be undefined

    if (!token) {
        res.status(401).json({ error: "Access Denied. No token provided." })        
    }

    try {
        const secret = process.env.JWT_SECRET || "supersecretkey"
        const decoded = jwt.verify(token as string, secret)
        req.user = decoded //attach decoded token (user info) to request object
        next()
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" })
    }
}