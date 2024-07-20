import app from "./app";
import { Config } from "./config";
import AppDataSource from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    const PORT = Config.PORT ?? 5502;
    try {
        await AppDataSource.initialize();
        logger.info("Database initialized...");

        app.listen(PORT, () => logger.info(`Listening on port ${PORT}`));
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(err.message);
            logger.on("finish", () => {
                process.exit(1);
            });
        }
    }
};

void startServer();
