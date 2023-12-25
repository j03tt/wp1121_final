import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

const authSchema = z.object({
  name: z.string().max(100).optional(),
  email: z.string().min(1).max(100).email(),
  password: z.string().min(8),
});

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "text" },
    name: { label: "Name", type: "text", optional: true },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    let validatedCredentials: {
      email: string;
      name?: string;
      password: string;
    };

    try {
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      throw new Error("Invalid credentials. Please check your input.");
    }
    const { email, name, password } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        name: usersTable.name,
        email: usersTable.email,
        provider: usersTable.provider,
        hashedPassword: usersTable.password,
      })
      .from(usersTable)
      .where(eq(usersTable.email, validatedCredentials.email.toLowerCase()))
      .execute();

    if (existedUser && name) {
      throw new Error("The email has already been registered.");
      // return null;
    }
    
    // sign up
    if (!existedUser) {
      // no username
      if (!name) {
        console.log("Name is required.");
        return null;
      }
      // username has been registered
      const [existedUserName] = await db
        .select({
          id: usersTable.displayId,
          name: usersTable.name,
          email: usersTable.email,
          provider: usersTable.provider,
          hashedPassword: usersTable.password,
        })
        .from(usersTable)
        .where(eq(usersTable.name, name))
        .execute();
      if (existedUserName) {
        throw new Error("The username has already been registered.");
        // return null;
      }

      const hashedPassword = await bcrypt.hash(password, 10); // change this line

      const [createdUser] = await db
        .insert(usersTable)
        .values({
          name: name,
          email: email.toLowerCase(),
          password: hashedPassword,
          provider: "credentials",
        })
        .returning();
      return {
        email: createdUser.email,
        name: createdUser.name,
        id: createdUser.displayId,
        provider: createdUser.provider,
      };
    }

    // Sign in
    if (existedUser.provider !== "credentials") {
      throw new Error(`The email has registered with ${existedUser.provider}.`);
      // return null;
    }
    if (!existedUser.hashedPassword) {
      throw new Error("The email has registered with a social account.");
      // return null;
    }
    const isValid = await bcrypt.compare(password, existedUser.hashedPassword); // change this line

    if (!isValid) {
      throw new Error("Wrong password. Try again.");
      // return null;
    }
    return {
      email: existedUser.email,
      name: existedUser.name,
      id: existedUser.id,
      provider: existedUser.provider,
    };
  },
});
