import express from "express";
import { env } from "./config";
import { prisma } from "./db";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "ok" });
  } catch (err) {
    res.status(500).json({ status: "fail", db: "down" });
  }
});

app.post("/seed", async (req, res) => {
  const city =
    typeof req.query.city === "string" ? req.query.city.trim() : "Itajai";

  const saved = await prisma.weatherRecord.create({
    data: {
      city,
      country: "BR",
      temp: 25.0,
      humidity: 60,
      description: "seed",
      sourceTime: new Date(),
    },
  });

  res.json(saved);
});

app.get("/weather", async (_req, res) => {
  const recs = await prisma.weatherRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json(recs);
});

app.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});
