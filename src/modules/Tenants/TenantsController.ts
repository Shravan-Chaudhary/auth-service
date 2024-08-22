import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { createInternalServerError } from "../../common/errors/http-exceptions";
import { TenantsService } from "./TenantsService";
import { Logger } from "winston";
import { TenantReqeust } from "../../types";

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
            next(createInternalServerError("error while creating tenant"));
        }
    }
}
