import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { TenantsService } from "./TenantsService";
import { Logger } from "winston";
import { TenantReqeust } from "../../types";
import CreateHttpError from "../../common/errors/http-exceptions";
import { HttpStatus } from "../../common/enums/http-codes";
import { validationResult } from "express-validator";

export class TenantsController {
    constructor(
        private tenantsService: TenantsService,
        private logger: Logger,
    ) {}

    async create(req: TenantReqeust, res: Response, next: NextFunction) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(HttpStatus.BAD_REQUEST).json({ errors: result.array() });
            return;
        }

        const { name, address } = req.body;
        try {
            const tenant = await this.tenantsService.create({ name, address });

            this.logger.info("Tenant created", { id: tenant.id });
            res.status(201).json({ id: tenant.id });
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(
                CreateHttpError.InternalServerError(
                    "error while creating tenant",
                ),
            );
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantsService.getAll();
            res.status(200).json(tenants);
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(
                CreateHttpError.InternalServerError(
                    "Error while getting tenants list",
                ),
            );
        }
    }

    async getOne(req: Request, res: Response, _next: NextFunction) {
        const body = req.body;
        res.json({ gettingOne: body });
    }
}
