/*
  Warnings:

  - A unique constraint covering the columns `[telefono]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clienteId,placa]` on the table `Motocicleta` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Sucursal` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Cliente_nombre_idx";

-- DropIndex
DROP INDEX "Cliente_telefono_idx";

-- AlterTable
ALTER TABLE "Sucursal" ALTER COLUMN "direccion" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_telefono_key" ON "Cliente"("telefono");

-- CreateIndex
CREATE INDEX "Cliente_activo_idx" ON "Cliente"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "Motocicleta_clienteId_placa_key" ON "Motocicleta"("clienteId", "placa");

-- CreateIndex
CREATE UNIQUE INDEX "Sucursal_nombre_key" ON "Sucursal"("nombre");
