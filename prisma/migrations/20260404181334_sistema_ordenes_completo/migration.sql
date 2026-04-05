/*
  Warnings:

  - You are about to drop the column `marca` on the `Motocicleta` table. All the data in the column will be lost.
  - You are about to drop the column `modelo` on the `Motocicleta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Motocicleta" DROP COLUMN "marca",
DROP COLUMN "modelo",
ADD COLUMN     "marcaManual" TEXT,
ADD COLUMN     "modeloManual" TEXT,
ADD COLUMN     "modeloMotoId" TEXT;

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL,
    "mostrarDesgloseRepuestos" BOOLEAN NOT NULL DEFAULT false,
    "nombreTaller" TEXT NOT NULL DEFAULT 'CCH Taller de Motos',
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "diasGarantiaDefault" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarcaMoto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarcaMoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamiliaMoto" (
    "id" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamiliaMoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModeloMoto" (
    "id" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "familiaId" TEXT,
    "nombre" TEXT NOT NULL,
    "cilindrada" TEXT,
    "categoria" TEXT,
    "precioMantenimiento1" DECIMAL(10,2),
    "precioMantenimiento2" DECIMAL(10,2),
    "precioMantenimiento3" DECIMAL(10,2),
    "conGarantia" BOOLEAN NOT NULL DEFAULT true,
    "diasGarantia" INTEGER NOT NULL DEFAULT 30,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModeloMoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicioManoObra" (
    "id" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioSemiautomatica" DECIMAL(10,2) NOT NULL,
    "precioMontoneta" DECIMAL(10,2) NOT NULL,
    "precioUrbana" DECIMAL(10,2) NOT NULL,
    "precioUrbanaGrande" DECIMAL(10,2) NOT NULL,
    "precioTrabajo" DECIMAL(10,2) NOT NULL,
    "aumentoAnual" DECIMAL(5,4) NOT NULL DEFAULT 0.31,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicioManoObra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantillaServicio" (
    "id" TEXT NOT NULL,
    "modeloMotoId" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantillaServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantillaServicioItem" (
    "id" TEXT NOT NULL,
    "plantillaId" TEXT NOT NULL,
    "productoId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlantillaServicioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" TEXT NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT NOT NULL,
    "marca" TEXT,
    "stockMinimo" INTEGER NOT NULL DEFAULT 5,
    "stockActual" INTEGER NOT NULL DEFAULT 0,
    "precioCompra" DECIMAL(10,2) NOT NULL,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "sucursalId" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mecanico" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "sucursalId" TEXT,
    "porcentajeComision" DECIMAL(5,2),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mecanico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenServicio" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clienteId" TEXT NOT NULL,
    "motocicletaId" TEXT NOT NULL,
    "sucursalId" TEXT NOT NULL,
    "mecanicoId" TEXT,
    "plantillaServicioId" TEXT,
    "tipoServicio" TEXT NOT NULL,
    "kilometrajeEntrada" INTEGER,
    "nivelCombustible" TEXT,
    "subtotalManoObra" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "subtotalRepuestos" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "iva" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "metodoPago" TEXT,
    "conGarantia" BOOLEAN NOT NULL DEFAULT true,
    "diasGarantia" INTEGER NOT NULL DEFAULT 30,
    "estadoOrden" TEXT NOT NULL DEFAULT 'recibida',
    "kilometrajeSalida" INTEGER,
    "fechaEntrega" TIMESTAMP(3),
    "observacionesCliente" TEXT,
    "observacionesMecanico" TEXT,
    "proximoServicioKm" INTEGER,
    "proximoServicioFecha" TIMESTAMP(3),
    "mostrarDesglose" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenServicioDetalle" (
    "id" TEXT NOT NULL,
    "ordenServicioId" TEXT NOT NULL,
    "servicioManoObraId" TEXT,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenServicioDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenServicioRepuesto" (
    "id" TEXT NOT NULL,
    "ordenServicioId" TEXT NOT NULL,
    "productoId" TEXT,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioCompra" DECIMAL(10,2) NOT NULL,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenServicioRepuesto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenServicioChecklist" (
    "id" TEXT NOT NULL,
    "ordenServicioId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "observacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrdenServicioChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarcaMoto_nombre_key" ON "MarcaMoto"("nombre");

-- CreateIndex
CREATE INDEX "FamiliaMoto_marcaId_idx" ON "FamiliaMoto"("marcaId");

-- CreateIndex
CREATE UNIQUE INDEX "FamiliaMoto_marcaId_nombre_key" ON "FamiliaMoto"("marcaId", "nombre");

-- CreateIndex
CREATE INDEX "ModeloMoto_marcaId_idx" ON "ModeloMoto"("marcaId");

-- CreateIndex
CREATE INDEX "ModeloMoto_familiaId_idx" ON "ModeloMoto"("familiaId");

-- CreateIndex
CREATE UNIQUE INDEX "ModeloMoto_marcaId_familiaId_nombre_key" ON "ModeloMoto"("marcaId", "familiaId", "nombre");

-- CreateIndex
CREATE INDEX "ServicioManoObra_categoria_idx" ON "ServicioManoObra"("categoria");

-- CreateIndex
CREATE INDEX "ServicioManoObra_activo_idx" ON "ServicioManoObra"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "ServicioManoObra_categoria_nombre_key" ON "ServicioManoObra"("categoria", "nombre");

-- CreateIndex
CREATE INDEX "PlantillaServicio_modeloMotoId_idx" ON "PlantillaServicio"("modeloMotoId");

-- CreateIndex
CREATE INDEX "PlantillaServicio_activo_idx" ON "PlantillaServicio"("activo");

-- CreateIndex
CREATE INDEX "PlantillaServicioItem_plantillaId_idx" ON "PlantillaServicioItem"("plantillaId");

-- CreateIndex
CREATE INDEX "PlantillaServicioItem_productoId_idx" ON "PlantillaServicioItem"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");

-- CreateIndex
CREATE INDEX "Producto_categoria_idx" ON "Producto"("categoria");

-- CreateIndex
CREATE INDEX "Producto_sucursalId_idx" ON "Producto"("sucursalId");

-- CreateIndex
CREATE INDEX "Producto_activo_idx" ON "Producto"("activo");

-- CreateIndex
CREATE INDEX "Mecanico_sucursalId_idx" ON "Mecanico"("sucursalId");

-- CreateIndex
CREATE INDEX "Mecanico_activo_idx" ON "Mecanico"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenServicio_numero_key" ON "OrdenServicio"("numero");

-- CreateIndex
CREATE INDEX "OrdenServicio_clienteId_idx" ON "OrdenServicio"("clienteId");

-- CreateIndex
CREATE INDEX "OrdenServicio_motocicletaId_idx" ON "OrdenServicio"("motocicletaId");

-- CreateIndex
CREATE INDEX "OrdenServicio_sucursalId_idx" ON "OrdenServicio"("sucursalId");

-- CreateIndex
CREATE INDEX "OrdenServicio_mecanicoId_idx" ON "OrdenServicio"("mecanicoId");

-- CreateIndex
CREATE INDEX "OrdenServicio_estadoOrden_idx" ON "OrdenServicio"("estadoOrden");

-- CreateIndex
CREATE INDEX "OrdenServicio_fecha_idx" ON "OrdenServicio"("fecha");

-- CreateIndex
CREATE INDEX "OrdenServicioDetalle_ordenServicioId_idx" ON "OrdenServicioDetalle"("ordenServicioId");

-- CreateIndex
CREATE INDEX "OrdenServicioDetalle_servicioManoObraId_idx" ON "OrdenServicioDetalle"("servicioManoObraId");

-- CreateIndex
CREATE INDEX "OrdenServicioRepuesto_ordenServicioId_idx" ON "OrdenServicioRepuesto"("ordenServicioId");

-- CreateIndex
CREATE INDEX "OrdenServicioRepuesto_productoId_idx" ON "OrdenServicioRepuesto"("productoId");

-- CreateIndex
CREATE INDEX "OrdenServicioChecklist_ordenServicioId_idx" ON "OrdenServicioChecklist"("ordenServicioId");

-- CreateIndex
CREATE INDEX "Motocicleta_modeloMotoId_idx" ON "Motocicleta"("modeloMotoId");

-- AddForeignKey
ALTER TABLE "Motocicleta" ADD CONSTRAINT "Motocicleta_modeloMotoId_fkey" FOREIGN KEY ("modeloMotoId") REFERENCES "ModeloMoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamiliaMoto" ADD CONSTRAINT "FamiliaMoto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "MarcaMoto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeloMoto" ADD CONSTRAINT "ModeloMoto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "MarcaMoto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModeloMoto" ADD CONSTRAINT "ModeloMoto_familiaId_fkey" FOREIGN KEY ("familiaId") REFERENCES "FamiliaMoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantillaServicio" ADD CONSTRAINT "PlantillaServicio_modeloMotoId_fkey" FOREIGN KEY ("modeloMotoId") REFERENCES "ModeloMoto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantillaServicioItem" ADD CONSTRAINT "PlantillaServicioItem_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "PlantillaServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantillaServicioItem" ADD CONSTRAINT "PlantillaServicioItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mecanico" ADD CONSTRAINT "Mecanico_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_motocicletaId_fkey" FOREIGN KEY ("motocicletaId") REFERENCES "Motocicleta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_mecanicoId_fkey" FOREIGN KEY ("mecanicoId") REFERENCES "Mecanico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_plantillaServicioId_fkey" FOREIGN KEY ("plantillaServicioId") REFERENCES "PlantillaServicio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicioDetalle" ADD CONSTRAINT "OrdenServicioDetalle_ordenServicioId_fkey" FOREIGN KEY ("ordenServicioId") REFERENCES "OrdenServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicioDetalle" ADD CONSTRAINT "OrdenServicioDetalle_servicioManoObraId_fkey" FOREIGN KEY ("servicioManoObraId") REFERENCES "ServicioManoObra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicioRepuesto" ADD CONSTRAINT "OrdenServicioRepuesto_ordenServicioId_fkey" FOREIGN KEY ("ordenServicioId") REFERENCES "OrdenServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicioRepuesto" ADD CONSTRAINT "OrdenServicioRepuesto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicioChecklist" ADD CONSTRAINT "OrdenServicioChecklist_ordenServicioId_fkey" FOREIGN KEY ("ordenServicioId") REFERENCES "OrdenServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
