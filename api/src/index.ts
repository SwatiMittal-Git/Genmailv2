import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';
import prisma from './db.js';

export const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))

export const legacyRequireAuth = (req: any, res: any, next: any) => {
    if (!req.auth) {
        return next(new Error('Unauthenticated'))
    }
    next()
}

export interface ReqWithUser extends Request {
    addedUser: JwtPayload
}

export const authRequire = (req: Request, res: Response, next: NextFunction) => {
    // console.log("Cookies: ", req.cookies);
    const token = req.cookies['userToken'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is required"
        });
    }

        jwt.verify(token, JWT_SECRET, (err: any, user: JwtPayload) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Token is invalid"
                });
            }
            let reqWithUser = req as ReqWithUser;
            reqWithUser.addedUser = user;
            // console.log("addedUser in authRequire: ", reqWithUser.addedUser);
            next();
        });
    };

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Working",
    });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);