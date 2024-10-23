import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { TenantsService } from "./TenantsService";
import { Logger } from "winston";
import { CreateTenantRequest, UpdateTenantRequest } from "../../types";
import CreateHttpError from "../../common/http/httpErrors";
import { HttpStatus } from "../../common/http/httpStatusCodes";
import { validationResult } from "express-validator";
import httpResponse from "../../common/http/httpResponse";
import ResponseMessage from "../../common/constants/responseMessage";

export class TenantsController {
    constructor(
        private readonly tenantsService: TenantsService,
        private readonly logger: Logger,
    ) {}

    public async create(
        req: CreateTenantRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                const err = CreateHttpError.BadRequestError(
                    result.array()[0].msg as string,
                );
                throw err;
            }

            const { name, address } = req.body;
            const tenant = await this.tenantsService.create({ name, address });

            this.logger.info("Tenant created", { id: tenant.id });
            httpResponse(
                req,
                res,
                HttpStatus.CREATED,
                ResponseMessage.CREATED,
                { id: tenant.id },
            );
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
            httpResponse(
                req,
                res,
                HttpStatus.OK,
                ResponseMessage.SUCCESS,
                tenants,
            );
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
            httpResponse(
                req,
                res,
                HttpStatus.OK,
                ResponseMessage.SUCCESS,
                tenant,
            );
        } catch (error) {
            next(error);
        }
    }

    public async update(
        req: UpdateTenantRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const result = validationResult(req);

            if (!result.isEmpty()) {
                const err = CreateHttpError.BadRequestError(
                    result.array()[0].msg as string,
                );
                throw err;
            }
            const { name, address } = req.body;
            const { id } = req.params;

            const tenant = await this.tenantsService.update(+id, {
                name,
                address,
            });
            httpResponse(
                req,
                res,
                HttpStatus.OK,
                ResponseMessage.SUCCESS,
                tenant,
            );
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
            httpResponse(
                req,
                res,
                HttpStatus.NO_CONTENT,
                ResponseMessage.SUCCESS,
                {},
            );
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
