import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import { privateEnv } from "@/lib/env/private";

const client = new Client({
  connectionString: privateEnv.POSTGRES_URL,
  connectionTimeoutMillis: 5000,
});

// to use top level await (await outside of an async function)
// we need to enable it in the tsconfig.json file to make typescript happy.
// Change the "target" field to "es2017" in the tsconfig.json file.
await client.connect();

export const db = drizzle(client);
