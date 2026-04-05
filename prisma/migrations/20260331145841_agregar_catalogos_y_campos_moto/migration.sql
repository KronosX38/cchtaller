-- DropIndex
DROP INDEX "Motocicleta_placa_idx";

-- AlterTable
ALTER TABLE "Motocicleta" ADD COLUMN     "cilindrada" TEXT,
ADD COLUMN     "kilometraje" INTEGER,
ADD COLUMN     "numeroSerie" TEXT;

-- CreateTable
CREATE TABLE "Catalogo" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catalogo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Catalogo_tipo_activo_idx" ON "Catalogo"("tipo", "activo");

-- CreateIndex
CREATE INDEX "Catalogo_orden_idx" ON "Catalogo"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "Catalogo_tipo_nombre_key" ON "Catalogo"("tipo", "nombre");

-- CreateIndex
CREATE INDEX "Motocicleta_activo_idx" ON "Motocicleta"("activo");
