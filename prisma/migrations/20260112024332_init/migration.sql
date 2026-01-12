-- CreateTable
CREATE TABLE "weather_records" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT,
    "temp" DOUBLE PRECISION,
    "humidity" INTEGER,
    "description" TEXT,
    "sourceTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "weather_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weather_records_city_idx" ON "weather_records"("city");
