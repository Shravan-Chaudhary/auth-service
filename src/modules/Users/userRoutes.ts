import express, {
    Request,
    Response,
    NextFunction,
    RequestHandler,
} from "express";
import authenticate from "../../common/middlewares/authenticate";
import canAccess from "../../common/middlewares/canAccess";
import { Roles } from "../../constants";
import { UserController } from "./UserController";
import { UserService } from "./UserService";
import { CredentialsService } from "../Credentials/CredentialsService";
import AppDataSource from "../../config/data-source";
import { User } from "../../entity/User";
import createUserValidator from "../../validators/create-user-validator";
import updateUserValidator from "../../validators/update-user-validator";
import { TenantsService } from "../Tenants/TenantsService";
import { Tenant } from "../../entity/Tenant";
import logger from "../../config/logger";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const tenantRepository = AppDataSource.getRepository(Tenant);
const credentialService = new CredentialsService();
const tenantService = new TenantsService(tenantRepository);
const userService = new UserService(credentialService, userRepository, logger);
const userController = new UserController(userService, tenantService);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    (async (req: Request, res: Response, next: NextFunction) => {
        await userController.create(req, res, next);
    }) as RequestHandler,
);
router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    (async (req: Request, res: Response, next: NextFunction) => {
        await userController.update(req, res, next);
    }) as RequestHandler,
);

router.get("/", authenticate, canAccess([Roles.ADMIN]), (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await userController.findAll(req, res, next);
}) as RequestHandler);

router.get("/:id", authenticate, (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await userController.findOne(req, res, next);
}) as RequestHandler);

router.delete("/:id", authenticate, canAccess([Roles.ADMIN]), (async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    await userController.delete(req, res, next);
}) as RequestHandler);

export default router;
