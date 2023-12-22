import type { DefaultSession } from "next-auth";

export type User = {
  id: string;
  name: string;
  email: string;
  provider: "github" | "credentials";
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: User;
  }
}
