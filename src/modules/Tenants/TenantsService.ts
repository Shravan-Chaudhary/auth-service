import { Repository } from "typeorm";
import { Tenant } from "../../entity/Tenant";
import { TenantData } from "../../types";

export class TenantsService {
    constructor(private tenantsRepository: Repository<Tenant>) {}

    async create({ name, address }: TenantData): Promise<Tenant> {
        return await this.tenantsRepository.save({
            name,
            address,
        });
    }
}
