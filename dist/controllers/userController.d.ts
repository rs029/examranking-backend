import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const signup: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getDashboardData: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map