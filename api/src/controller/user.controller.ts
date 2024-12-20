import { Request, Response } from "express";
import prisma from "../db.js";
import { ReqWithUser } from "../index.js";

export const fetchUser = async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await prisma.user.findFirst({
        where: {
            id
        },
        select: {
            name: true,
            email: true,
            Branch: true,
            college: true,
            Year: true,
            Skills: true,
            title: true,
        }
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        success: true,
        user
    });
}
