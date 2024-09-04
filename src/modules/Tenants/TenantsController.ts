import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { TenantsService } from "./TenantsService";
import { Logger } from "winston";
import { TenantReqeust } from "../../types";
import CreateHttpError from "../../common/errors/http-exceptions";

export class TenantsController {
    constructor(
        private tenantsService: TenantsService,
        private logger: Logger,
    ) {}

    async create(req: TenantReqeust, res: Response, next: NextFunction) {
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

    async getAll(req: Request, res: Response, _next: NextFunction) {
        const body = req.body;
        res.json({ gettingAll: body });
    }

    async getOne(req: Request, res: Response, _next: NextFunction) {
        const body = req.body;
        res.json({ gettingOne: body });
    }
}
