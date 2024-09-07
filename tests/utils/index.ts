import { Repository } from "typeorm";
import { Tenant } from "../../src/entity/Tenant";

export const createTenant = async (tenantRepository: Repository<Tenant>) => {
    const tenant = await tenantRepository.save({
        name: "tenant 1",
        address: "dalanwala, dehradun",
    });
    return tenant;
};

export const isValidJwt = (token: string | null): boolean => {
    if (token === null) {
        return false;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, "base64").toString("utf-8");
        });
        return true;
    } catch (error) {
        return false;
    }
};
