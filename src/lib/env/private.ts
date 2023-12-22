import { z } from "zod";

const privateEnvSchema = z.object({
  POSTGRES_URL: z.string().url(),
  AUTH_SECRET: z.string(),
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
  NEXT_PUBLIC_BASE_URL: z.string(),
});

type PrivateEnv = z.infer<typeof privateEnvSchema>;

export const privateEnv: PrivateEnv = {
  POSTGRES_URL: process.env.POSTGRES_URL!,
  AUTH_SECRET: process.env.AUTH_SECRET!,
  AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID!,
  AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET!,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL!,
};

privateEnvSchema.parse(privateEnv);
