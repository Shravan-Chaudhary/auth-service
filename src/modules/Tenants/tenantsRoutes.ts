import express, { RequestHandler } from "express";
import AppDataSource from "../../config/data-source";
import { Tenant } from "../../entity/Tenant";
import { TenantsService } from "./TenantsService";
import { TenantsController } from "./TenantsController";
import logger from "../../config/logger";

const router = express.Router();
const tenantsRepository = AppDataSource.getRepository(Tenant);
const tenantsService = new TenantsService(tenantsRepository);
const tenantsController = new TenantsController(tenantsService, logger);

router.post("/", (async (req, res, next) => {
    await tenantsController.create(req, res, next);
}) as RequestHandler);

export default router;
