import { Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUpSignIn = async (req: Request, res: Response) => {
    const { username: name, email, password, accountType, isSignUp, college, branch, year, skills, title } = req.body;

    const generateToken = (user: any) => {
        const token = jwt.sign({ id: user.id, email: user.email, accountType }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true }); // 7 days
        return token;
    };

    try {
        if (isSignUp) {
            console.log("signing up: ", req.body);
            const existingUser = await prisma.user.findFirst({ where: { email }});
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    Branch: branch,
                    college,
                    Year: year,
                    Skills: skills,
                    title
                }
            });

            const token = generateToken(newUser);
            res.cookie('accountType', accountType, { path: '/', sameSite: 'none', secure: true });
            return res.status(200).json({
                success: true,
                message: "User created successfully",
                user: newUser,
                token
            });
        } else {
            const existingUser = await prisma.user.findFirst({ where: { email } });
            if (!existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User does not exist",
                });
            }
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            const token = generateToken(existingUser);
            res.cookie('accountType', accountType, { path: '/', sameSite: 'none', secure: true });
            res.cookie('userId', existingUser.id, { path: '/', sameSite: 'none', secure: true });
            return res.status(200).json({
                success: true,
                message: "User signed in successfully",
                user: existingUser,
                token
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}