import { Request, Response } from "express"
import * as userService from "../services/userService"

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers()
        res.json(users)
    }  catch (error) {
        res.status(500).json({error: "Failed to fetch users"})
    }
}

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body
    console.log('Controller: Received request to create user:', { email, name })
    
    try {
        const newUser = await userService.createUser(name, email, password)
        console.log('Controller: User created successfully:', newUser)
        res.status(201).json(newUser)
    } catch (error) {
        console.error('Controller: Error creating user:', error)
        res.status(500).json({
            error: "Failed to create user",
            details: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const login = async (req:Request, res:Response) => {
    try {
        const { email, password } = req.body
        const { token, user } =  await userService.loginUser(email, password)
        res.status(200).json({ message: "Login Successful", token, user })
    } catch (error) {
        res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid credentials' })
    }
    
}