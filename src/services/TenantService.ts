import { Repository } from "typeorm";
import { TenantData } from "../types";
import { Tenant } from "../entity/Tenant";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class TenantService {
  constructor(private tenantRepository: Repository<Tenant>) {}

  async create({ name, address }: TenantData): Promise<Tenant> {
    // Check if tenant already exists
    const tenant = await this.tenantRepository.findOne({
      where: {
        name: name,
      },
    });

    if (tenant) {
      if (tenant) {
        const error = createHttpError(409, "Tenant already exists with this name");
        throw error;
      }
    }
    // Store tenant in database
    try {
      return await this.tenantRepository.save({
        name,
        address,
        role: Roles.ADMIN,
      });
    } catch (err) {
      const error = createHttpError(500, "Failed to store tenant in database");
      throw error;
    }
  }

  async getAll(): Promise<Tenant[]> {
    try {
      return await this.tenantRepository.find();
    } catch (err) {
      const error = createHttpError(500, "Failed to get tenants from database");
      throw error;
    }
  }

  async getById(id: number): Promise<Tenant> {
    try {
      const tenant = await this.tenantRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!tenant) {
        const error = createHttpError(404, "Tenant not found");
        throw error;
      }

      return tenant;
    } catch (err) {
      const error = createHttpError(500, "Failed to get tenant from database (TenantService)");
      throw error;
    }
  }

  async update(id: number, tenantData: TenantData): Promise<Tenant> {
    const { name, address } = tenantData;
    try {
      const tenant = await this.tenantRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!tenant) {
        const error = createHttpError(404, "Tenant not found");
        throw error;
      }

      await this.tenantRepository.update({ id }, { name, address });
      const updatedTenant = await this.tenantRepository.findOne({ where: { id } });
      if (!updatedTenant) {
        const error = createHttpError(404, "Updated tenant not found");
        throw error;
      }
      return updatedTenant;
    } catch (err) {
      const error = createHttpError(500, "Failed to update tenant from database (TenantService)");
      throw error;
    }
  }
}
