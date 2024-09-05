import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { TenantsService } from "./TenantsService";
import { Logger } from "winston";
import { CreateTenantRequest, UpdateTenantRequest } from "../../types";
import CreateHttpError from "../../common/errors/http-exceptions";
import { HttpStatus } from "../../common/enums/http-codes";
import { validationResult } from "express-validator";

export class TenantsController {
    constructor(
        private tenantsService: TenantsService,
        private logger: Logger,
    ) {}

    public async create(
        req: CreateTenantRequest,
        res: Response,
        next: NextFunction,
    ) {
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

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantsService.findAll();
            res.status(HttpStatus.OK).json(tenants);
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

    public async getOne(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const tenant = await this.tenantsService.findOneById(+id);
            res.status(HttpStatus.OK).json(tenant);
        } catch (error) {
            next(error);
        }
    }

    public async update(
        req: UpdateTenantRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            res.status(HttpStatus.BAD_REQUEST).json({ errors: result.array() });
            return;
        }
        const { name, address } = req.body;
        const { id } = req.params;

        try {
            const tenant = await this.tenantsService.update(+id, {
                name,
                address,
            });
            res.status(HttpStatus.OK).json(tenant);
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(
                CreateHttpError.InternalServerError(
                    "Error while updating tenant",
                ),
            );
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            await this.tenantsService.delete(+id);
            res.status(204).json();
        } catch (error) {
            if (error instanceof createHttpError.HttpError) {
                next(error);
                return;
            }
            next(
                CreateHttpError.InternalServerError(
                    "Error while deleting tenant",
                ),
            );
        }
    }
}
