import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({ NODE_ENV:z.enum(['development','test','production']).default('development'), PORT:z.coerce.number().default(4000), MONGODB_URI:z.string().default('mongodb://localhost:27017/creemy'), JWT_ACCESS_SECRET:z.string().min(16).default('development-access-secret-change-me'), JWT_REFRESH_SECRET:z.string().min(16).default('development-refresh-secret-change-me'), CORS_ORIGIN:z.string().default('http://localhost:5173') });
export const env=schema.parse(process.env);
