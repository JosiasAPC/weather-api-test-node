import { prisma } from "./db";

export async function waitForDb(retries = 10, delayMs = 1500) {
  for (let i = 1; i <= retries; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return;
    } catch {
      if (i === retries) throw new Error("Database not ready after retries");
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
