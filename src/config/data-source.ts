import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DATABASE_HOST,
    port: Number(Config.DATABASE_PORT),
    username: Config.DATABASE_USERNAME,
    password: Config.DATABASE_PASSWORD,
    database: Config.DATABASE_NAME,
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.{ts,js}"],
    migrations: ["src/migrations/*.{ts,js}"],
    subscribers: [],
});

export default AppDataSource;
