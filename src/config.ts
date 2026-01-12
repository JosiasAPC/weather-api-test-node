import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(8000),
  OPENWEATHER_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
