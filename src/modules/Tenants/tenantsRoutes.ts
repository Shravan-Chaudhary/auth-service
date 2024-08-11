import express, { RequestHandler } from "express";
import { TenantsController } from "./TenantsController";

const router = express.Router();
const tenantsController = new TenantsController();

router.post("/", (async (req, res, next) => {
    await tenantsController.create(req, res, next);
}) as RequestHandler);

export default router;
