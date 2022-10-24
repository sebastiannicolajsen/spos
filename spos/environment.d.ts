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
      REDIS_HOST: string;
      LOG_TYPE: 'console' | 'file' | 'none'  ;
    }
  }
}

export {};
