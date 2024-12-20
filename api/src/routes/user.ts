import { Router } from "express";
import { fetchUser } from "../controller/user.controller";

const router = Router();
router.get("/", fetchUser);


export default router;