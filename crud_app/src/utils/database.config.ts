import { configDotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';

configDotenv();
export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  database: process.env.DATABASE_NAME,
  entities: [User, Article],
  migrationsTableName: 'migrations',
  migrations: [`${__dirname}/migrations/**.*?s`],
  migrationsRun: true,
  synchronize: process.env.NODE_ENV === 'development',
  logging: true,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  username: process.env.DATABASE_USER,
  port: Number(process.env.DATABASE_PORT),
};

export const connectionSource = new DataSource(databaseConfig);
