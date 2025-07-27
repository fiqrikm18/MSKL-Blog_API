import path from "node:path";
import dotenv from "dotenv";
import type { PrismaConfig } from "prisma";

dotenv.config();

export default {
  earlyAccess: true,
  schema: path.join("prisma"),
} satisfies PrismaConfig;
