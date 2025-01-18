import { createSchema } from 'schemix';
import { PrismaDataSourceProvider } from 'schemix/dist/typings/prisma-datasource';

createSchema({
  // basePath should be a path to the folder containing models/, enums/, and mixins/.
  basePath: __dirname,
  datasource: {
    provider: (process.env.DB_TYPE as PrismaDataSourceProvider) ?? 'postgresql',
    url: { env: 'DATABASE_URL' },

    ...(process.env.DIRECT_URL !== undefined
      ? { directUrl: process.env.DIRECT_URL }
      : {}),
  },
  generator: {
    provider: 'prisma-client-js',
  },
}).export(__dirname, 'schema');
