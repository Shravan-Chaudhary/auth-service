import express, { NextFunction, Request, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import logger from "../config/logger";

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post("/", (req: Request, res: Response, next: NextFunction) =>
  tenantController.create(req as CreateTenantRequest, res, next)
);

export default router;
