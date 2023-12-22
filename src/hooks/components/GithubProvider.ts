import GitHub from "next-auth/providers/github";
import { publicEnv } from "@/lib/env/public";

const githubProvider = GitHub({
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
});

export default githubProvider;

