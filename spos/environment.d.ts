import { DataSourceOptions } from "typeorm";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            DATABASE_PORT: string;
            DATABASE_TYPE: 'postgres' | 'sqlite';
            DATABASE_HOST: string;
            DATABASE_USERNAME: string;
            DATABASE_NAME: string;
            DATABASE_PASSWORD: string;
            JWT_SECRET: string;
        }
    }
}

export {}