import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import { CreateTenantRequest } from "../types";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger
  ) {}
  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // validation and sanitization of request body
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const { name, address } = req.body;
    this.logger.debug("New Request to create a tenant", { name, address });

    // Create tenant
    try {
      const tenant = await this.tenantService.create({ name, address });
      this.logger.info("Tenant created", { id: tenant.id });
      res.status(201).json({ id: tenant.id });
    } catch (err) {
      next(err);
      return;
    }
  }

  async getTenants(req: Request, res: Response, next: NextFunction) {
    // Get all tenants by using tenantService instance
    try {
      const tenants = await this.tenantService.getAll();
      res.status(200).json(tenants);
    } catch (err) {
      const error = createHttpError(500, "Failed to get tenants from database");
      next(error);
    }
  }

  async getTenantById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const tenant = await this.tenantService.getById(Number(id));
      res.status(200).json(tenant);
    } catch (err) {
      const error = createHttpError(500, "Failed to get tenant from database");
      next(error);
    }
  }
  // TODO: Update tenant method
  async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
    // validation
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    const { name, address } = req.body;

    // check the req params id
    const { tenantId } = req.params;
    if (isNaN(Number(tenantId))) {
      const error = createHttpError(400, "Invalid url param");
      next(error);
      return;
    }

    this.logger.debug("New Request to update a tenant", { tenantId });

    try {
      await this.tenantService.update(Number(tenantId), {
        name,
        address,
      });

      res.status(200).json({ id: Number(tenantId) });
    } catch (err) {
      const error = createHttpError(500, "Failed to update tenant from database");
      next(error);
    }
  }
  // TODO: Delete tenant method
}
