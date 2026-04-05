-- CreateTable
CREATE TABLE "Sucursal" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT,
    "esMatriz" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion" TEXT,
    "sucursalId" TEXT NOT NULL,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motocicleta" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "year" INTEGER,
    "placa" TEXT,
    "color" TEXT,
    "notas" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motocicleta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cliente_sucursalId_idx" ON "Cliente"("sucursalId");

-- CreateIndex
CREATE INDEX "Cliente_telefono_idx" ON "Cliente"("telefono");

-- CreateIndex
CREATE INDEX "Cliente_nombre_idx" ON "Cliente"("nombre");

-- CreateIndex
CREATE INDEX "Motocicleta_clienteId_idx" ON "Motocicleta"("clienteId");

-- CreateIndex
CREATE INDEX "Motocicleta_placa_idx" ON "Motocicleta"("placa");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motocicleta" ADD CONSTRAINT "Motocicleta_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
