import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'projectdb',
  schema: 'public',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*{.ts,js}'],
  synchronize: false,
  logging: true,
  namingStrategy: new SnakeNamingStrategy(),
};

export const AppDataSource = new DataSource({ ...typeormConfig });

export const typeormConfigFactory = (): TypeOrmModuleOptions => ({
  ...typeormConfig,
  logging: ['query', 'error'],
});
