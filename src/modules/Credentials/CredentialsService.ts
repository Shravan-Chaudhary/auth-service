import bcrypt from "bcryptjs";
import { createUnauthorizedError } from "../../common/errors/http-exceptions";

export class CredentialsService {
    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword: string) {
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw createUnauthorizedError("email or password does not match");
        }
        return match;
    }
}
