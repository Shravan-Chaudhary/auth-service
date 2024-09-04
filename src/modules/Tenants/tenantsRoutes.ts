import express, { RequestHandler } from "express";
import AppDataSource from "../../config/data-source";
import { Tenant } from "../../entity/Tenant";
import { TenantsService } from "./TenantsService";
import { TenantsController } from "./TenantsController";
import logger from "../../config/logger";
import authenticate from "../../common/middlewares/authenticate";
import canAccess from "../../common/middlewares/canAccess";
import { Roles } from "../../constants";
import createTenantValidator from "../../validators/create-tenant-validator";

const router = express.Router();
const tenantsRepository = AppDataSource.getRepository(Tenant);
const tenantsService = new TenantsService(tenantsRepository);
const tenantsController = new TenantsController(tenantsService, logger);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    createTenantValidator,
    (async (req, res, next) => {
        await tenantsController.create(req, res, next);
    }) as RequestHandler,
);

router.get("/", (async (req, res, next) => {
    await tenantsController.getAll(req, res, next);
}) as RequestHandler);

router.get("/:id", (async (req, res, next) => {
    await tenantsController.getOne(req, res, next);
}) as RequestHandler);

export default router;
