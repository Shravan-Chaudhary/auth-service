import { Repository } from "typeorm";
import { Tenant } from "../../entity/Tenant";
import { TenantData } from "../../types";
import CreateHttpError from "../../common/errors/http-exceptions";

export class TenantsService {
    constructor(private tenantsRepository: Repository<Tenant>) {}

    public async create({ name, address }: TenantData): Promise<Tenant> {
        return await this.tenantsRepository.save({
            name,
            address,
        });
    }

    public async getAll(): Promise<Tenant[]> {
        return await this.tenantsRepository.find();
    }

    public async getOneById(id: number): Promise<Tenant> {
        const tenant = await this.tenantsRepository.findOne({
            where: {
                id,
            },
        });

        if (!tenant) {
            throw CreateHttpError.NotFoundError(
                "Tenant not found with provided id",
            );
        }

        return tenant;
    }
}
