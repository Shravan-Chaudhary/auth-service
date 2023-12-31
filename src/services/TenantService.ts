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

  async getAllTenants(): Promise<Tenant[]> {
    try {
      return await this.tenantRepository.find();
    } catch (err) {
      const error = createHttpError(500, "Failed to get tenants from database");
      throw error;
    }
  }
}
