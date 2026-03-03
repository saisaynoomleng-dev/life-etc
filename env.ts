import * as z from 'zod';

// server variables
const serverSchema = z.object({
  SANITY_STUDIO_PROJECT_ID: z.string().min(1),
  SANITY_STUDIO_DATASET: z.string().min(1),
  SANITY_READ_TOKEN: z.string().min(1),
  SANITY_WRITE_TOKEN: z.string().min(1),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  CLERK_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
});

// client variables
const clientSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
  NEXT_PUBLIC_BASE_URL: z.url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
});

const schema = serverSchema.extend(clientSchema.shape);
const env = schema.parse(process.env);

export default env;
