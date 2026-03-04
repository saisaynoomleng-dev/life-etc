import 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import env from '../../env';

const sql = neon(env.DATABASE_URL);
const db = drizzle(sql, { schema, logger: true });

export default db;
