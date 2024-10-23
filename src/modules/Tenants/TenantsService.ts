import { Repository } from "typeorm";
import { Tenant } from "../../entity/Tenant";
import { ITenantData } from "../../types";
import CreateHttpError from "../../common/http/httpErrors";

export class TenantsService {
    constructor(private readonly tenantsRepository: Repository<Tenant>) {}

    public async create(tenantData: ITenantData): Promise<Tenant> {
        return await this.tenantsRepository.save(tenantData);
    }

    public async update(id: number, tenantData: ITenantData) {
        const tenant = await this.tenantsRepository.update(id, tenantData);

        if (!tenant) {
            throw CreateHttpError.NotFoundError("No tenant found with this id");
        }
        return tenant;
    }

    //TODO: Sort tenants before returning
    public async findAll(): Promise<Tenant[]> {
        return await this.tenantsRepository.find();
    }

    public async findOneById(id: number): Promise<Tenant> {
        const tenant = await this.tenantsRepository.findOne({
            where: {
                id,
            },
        });

        if (!tenant) {
            throw CreateHttpError.NotFoundError("No tenant found with this id");
        }

        return tenant;
    }

    public async delete(id: number) {
        const tenant = await this.tenantsRepository.delete(id);
        if (!tenant) {
            throw CreateHttpError.NotFoundError("No tenant found with this id");
        }

        return tenant;
    }
}
