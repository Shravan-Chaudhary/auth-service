import bcrypt from "bcryptjs";
import CreateHttpError from "../../common/http/httpErrors";

export class CredentialsService {
    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword: string) {
        const match = await bcrypt.compare(password, hashedPassword);
        if (!match) {
            throw CreateHttpError.UnauthorizedError(
                "email or password does not match",
            );
        }
        return match;
    }
}
