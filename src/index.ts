import express from "express";
import { env } from "./config";
import { prisma } from "./db";
import { fetchWeather } from "./openweather";
import { waitForDb } from "./startup";
import { setupSwagger } from "./swagger";

const app = express();
setupSwagger(app);

app.use(express.json());

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check da API
 *     responses:
 *       200:
 *         description: API e banco funcionando
 *         content:
 *           application/json:
 *             example:
 *               status: ok
 *               db: ok
 */

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "ok" });
  } catch (err) {
    res.status(500).json({ status: "fail", db: "down" });
  }
});

/**
 * @swagger
 * /fetch:
 *   get:
 *     summary: Busca clima na OpenWeather e salva no banco
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         example: Itajai
 *     responses:
 *       200:
 *         description: Registro salvo com sucesso
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               city: "Itajaí"
 *               country: "BR"
 *               temp: 27.16
 *               humidity: 81
 *               description: "algumas nuvens"
 *               sourceTime: "2026-01-13T19:13:46.000Z"
 *               createdAt: "2026-01-13T19:16:10.655Z"
 */

app.get("/fetch", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ error: "city is required" });
  }

  try {
    const data = await fetchWeather(city);

    const saved = await prisma.weatherRecord.create({
      data,
    });

    res.json(saved);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch weather",
      detail: err.message,
    });
  }
});

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Lista os últimos registros salvos
 *     responses:
 *       200:
 *         description: Lista de registros
 *         content:
 *           application/json:
 *             example:
 *               - id: 4
 *                 city: "Itajaí"
 *                 country: "BR"
 *                 temp: 27.16
 *                 humidity: 81
 *                 description: "algumas nuvens"
 *                 sourceTime: "2026-01-13T19:13:46.000Z"
 *                 createdAt: "2026-01-13T19:16:10.655Z"
 */

app.get("/weather", async (_req, res) => {
  const recs = await prisma.weatherRecord.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json(recs);
});

/**
 * @swagger
 * /weather/latest:
 *   get:
 *     summary: Retorna o último registro de uma cidade
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         example: Itajai
 *     responses:
 *       200:
 *         description: Último registro encontrado
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               city: "Itajaí"
 *               country: "BR"
 *               temp: 27.16
 *               humidity: 81
 *               description: "algumas nuvens"
 *               sourceTime: "2026-01-13T19:13:46.000Z"
 *               createdAt: "2026-01-13T19:16:10.655Z"
 */

app.get("/weather/latest", async (req, res) => {
  const city = String(req.query.city || "").trim();

  if (!city) {
    return res.status(400).json({ error: "city is required" });
  }

  const record = await prisma.weatherRecord.findFirst({
    where: {
      city: {
        equals: city,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!record) {
    return res.status(404).json({ error: "No data for this city" });
  }

  res.json(record);
});

async function main() {
  await waitForDb();

  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
