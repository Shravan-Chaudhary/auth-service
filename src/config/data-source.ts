import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DATABASE_HOST,
    port: Number(Config.DATABASE_PORT),
    username: Config.DATABASE_USERNAME,
    password: Config.DATABASE_PASSWORD,
    database: Config.DATABASE_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});

export default AppDataSource;
