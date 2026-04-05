// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed completo...')

  // ============================================
  // 1. CONFIGURACIÓN GENERAL
  // ============================================
  console.log('⚙️  Creando configuración...')
  
  await prisma.configuracion.upsert({
    where: { id: 'config-default' },
    update: {},
    create: {
      id: 'config-default',
      mostrarDesgloseRepuestos: false,
      nombreTaller: 'CCH Taller de Motos',
      direccion: 'Calle 187-J 551 entre 104 y 106, Fracc. Santa Cruz Palomeque',
      telefono: '(999) 162 85 94',
      diasGarantiaDefault: 30,
    },
  })

  // ============================================
  // 2. SUCURSALES
  // ============================================
  console.log('📍 Creando sucursales...')
  
  const santaCruz = await prisma.sucursal.upsert({
    where: { nombre: 'Santa Cruz' },
    update: {},
    create: {
      nombre: 'Santa Cruz',
      direccion: 'Calle 187-J 551 entre 104 y 106',
      telefono: '9991628594',
      esMatriz: true,
      activo: true,
    },
  })

  const caucel = await prisma.sucursal.upsert({
    where: { nombre: 'Caucel' },
    update: {},
    create: {
      nombre: 'Caucel',
      direccion: 'Calle 50 x 25, Caucel',
      telefono: '9991404755',
      esMatriz: false,
      activo: true,
    },
  })

  // ============================================
  // 3. CATÁLOGOS
  // ============================================
  console.log('📋 Creando catálogos...')

  const catalogos = [
    // MARCAS DE MOTOS (ya existentes)
    { tipo: 'marca_moto', nombre: 'YAMAHA', orden: 1 },
    { tipo: 'marca_moto', nombre: 'HONDA', orden: 2 },
    { tipo: 'marca_moto', nombre: 'SUZUKI', orden: 3 },
    { tipo: 'marca_moto', nombre: 'KAWASAKI', orden: 4 },
    { tipo: 'marca_moto', nombre: 'ITALIKA', orden: 5 },
    { tipo: 'marca_moto', nombre: 'VENTO', orden: 6 },
    { tipo: 'marca_moto', nombre: 'BAJAJ', orden: 7 },
    { tipo: 'marca_moto', nombre: 'KIWO', orden: 8 },
    { tipo: 'marca_moto', nombre: 'VELOCI', orden: 9 },
    { tipo: 'marca_moto', nombre: 'OTRA', orden: 99 },

    // TIPOS DE SERVICIO
    { tipo: 'tipo_servicio', nombre: 'Mantenimiento preventivo', orden: 1 },
    { tipo: 'tipo_servicio', nombre: 'Reparación general', orden: 2 },
    { tipo: 'tipo_servicio', nombre: 'Reparación eléctrica', orden: 3 },
    { tipo: 'tipo_servicio', nombre: 'Diagnóstico', orden: 4 },

    // MÉTODOS DE PAGO
    { tipo: 'metodo_pago', nombre: 'Efectivo', orden: 1 },
    { tipo: 'metodo_pago', nombre: 'Tarjeta débito', orden: 2 },
    { tipo: 'metodo_pago', nombre: 'Tarjeta crédito', orden: 3 },
    { tipo: 'metodo_pago', nombre: 'Transferencia', orden: 4 },

    // ESTADOS DE ORDEN
    { tipo: 'estado_orden', nombre: 'Recibida', orden: 1 },
    { tipo: 'estado_orden', nombre: 'En diagnóstico', orden: 2 },
    { tipo: 'estado_orden', nombre: 'En reparación', orden: 3 },
    { tipo: 'estado_orden', nombre: 'Esperando repuestos', orden: 4 },
    { tipo: 'estado_orden', nombre: 'Completada', orden: 5 },
    { tipo: 'estado_orden', nombre: 'Entregada', orden: 6 },
    { tipo: 'estado_orden', nombre: 'Cancelada', orden: 7 },

    // CATEGORÍAS DE MOTOS
    { tipo: 'categoria_moto', nombre: 'Semiautomática', orden: 1 },
    { tipo: 'categoria_moto', nombre: 'Motoneta', orden: 2 },
    { tipo: 'categoria_moto', nombre: 'Urbana', orden: 3 },
    { tipo: 'categoria_moto', nombre: 'Urbana grande (250-300cc)', orden: 4 },
    { tipo: 'categoria_moto', nombre: 'Trabajo', orden: 5 },
  ]

  for (const cat of catalogos) {
    await prisma.catalogo.upsert({
      where: {
        tipo_nombre: {
          tipo: cat.tipo,
          nombre: cat.nombre,
        },
      },
      update: { orden: cat.orden },
      create: cat,
    })
  }

  console.log(`✅ ${catalogos.length} catálogos creados`)

  // ============================================
  // 4. MARCAS Y MODELOS DE MOTOS
  // ============================================
  console.log('🏍️ Creando marcas y modelos...')

  // YAMAHA
  const yamaha = await prisma.marcaMoto.upsert({
    where: { nombre: 'YAMAHA' },
    update: {},
    create: { nombre: 'YAMAHA' },
  })

  const yamahaUrbanas = await prisma.familiaMoto.upsert({
    where: {
      marcaId_nombre: {
        marcaId: yamaha.id,
        nombre: 'URBANAS',
      },
    },
    update: {},
    create: {
      marcaId: yamaha.id,
      nombre: 'URBANAS',
    },
  })

  await prisma.modeloMoto.upsert({
    where: {
      marcaId_familiaId_nombre: {
        marcaId: yamaha.id,
        familiaId: yamahaUrbanas.id,
        nombre: 'R15',
      },
    },
    update: {},
    create: {
      marcaId: yamaha.id,
      familiaId: yamahaUrbanas.id,
      nombre: 'R15',
      cilindrada: '150cc',
      categoria: 'urbana',
      precioMantenimiento1: 750,
      precioMantenimiento2: 850,
      precioMantenimiento3: 900,
    },
  })

  // HONDA
  const honda = await prisma.marcaMoto.upsert({
    where: { nombre: 'HONDA' },
    update: {},
    create: { nombre: 'HONDA' },
  })

  const hondaDeportivas = await prisma.familiaMoto.upsert({
    where: {
      marcaId_nombre: {
        marcaId: honda.id,
        nombre: 'DEPORTIVAS',
      },
    },
    update: {},
    create: {
      marcaId: honda.id,
      nombre: 'DEPORTIVAS',
    },
  })

  await prisma.modeloMoto.upsert({
    where: {
      marcaId_familiaId_nombre: {
        marcaId: honda.id,
        familiaId: hondaDeportivas.id,
        nombre: 'CBR 250R',
      },
    },
    update: {},
    create: {
      marcaId: honda.id,
      familiaId: hondaDeportivas.id,
      nombre: 'CBR 250R',
      cilindrada: '250cc',
      categoria: 'urbana_grande',
      precioMantenimiento1: 850,
      precioMantenimiento2: 950,
      precioMantenimiento3: 1000,
    },
  })

  // ============================================
  // 5. SERVICIOS DE MANO DE OBRA
  // ============================================
  console.log('🔧 Creando servicios de mano de obra...')

  const serviciosManoObra = [
    {
      categoria: 'MANTENIMIENTO',
      nombre: 'Mantenimiento preventivo',
      descripcion: 'Mantenimiento preventivo completo',
      precioSemiautomatica: 600,
      precioMontoneta: 600,
      precioUrbana: 750,
      precioUrbanaGrande: 982.5,
      precioTrabajo: 650,
    },
    {
      categoria: 'MOTOR',
      nombre: 'Cambio de bujía',
      precioSemiautomatica: 100,
      precioMontoneta: 100,
      precioUrbana: 100,
      precioUrbanaGrande: 100,
      precioTrabajo: 100,
    },
    {
      categoria: 'MOTOR',
      nombre: 'Cambio de aceite',
      precioSemiautomatica: 100,
      precioMontoneta: 102,
      precioUrbana: 102,
      precioUrbanaGrande: 102,
      precioTrabajo: 102,
    },
    {
      categoria: 'CARBURADOR',
      nombre: 'Lavado y calibración de carburador',
      precioSemiautomatica: 197,
      precioMontoneta: 197,
      precioUrbana: 197,
      precioUrbanaGrande: 197,
      precioTrabajo: 197,
    },
    {
      categoria: 'CHICOTE',
      nombre: 'Cambio de chicote de freno',
      precioSemiautomatica: 100,
      precioMontoneta: 100,
      precioUrbana: 100,
      precioUrbanaGrande: 100,
      precioTrabajo: 100,
    },
    {
      categoria: 'CHICOTE',
      nombre: 'Cambio de chicote de clutch',
      precioSemiautomatica: 100,
      precioMontoneta: 100,
      precioUrbana: 100,
      precioUrbanaGrande: 100,
      precioTrabajo: 100,
    },
    {
      categoria: 'DIRECCIÓN',
      nombre: 'Ajuste de yugo',
      precioSemiautomatica: 450,
      precioMontoneta: 450,
      precioUrbana: 400,
      precioUrbanaGrande: 400,
      precioTrabajo: 400,
    },
  ]

  for (const servicio of serviciosManoObra) {
    await prisma.servicioManoObra.upsert({
      where: {
        categoria_nombre: {
          categoria: servicio.categoria,
          nombre: servicio.nombre,
        },
      },
      update: {},
      create: servicio,
    })
  }

  console.log(`✅ ${serviciosManoObra.length} servicios de mano de obra creados`)

  // ============================================
  // 6. PRODUCTOS (INVENTARIO)
  // ============================================
  console.log('📦 Creando productos...')

  const productos = [
    {
      codigo: 'ACE-CAST-1L',
      nombre: 'Aceite Castrol 20W50 1L',
      categoria: 'Aceites',
      marca: 'Castrol',
      stockMinimo: 20,
      stockActual: 45,
      precioCompra: 85,
      precioVenta: 200,
      sucursalId: santaCruz.id,
    },
    {
      codigo: 'FIL-HF123',
      nombre: 'Filtro de aceite HF123',
      categoria: 'Filtros',
      marca: 'HiFlo',
      stockMinimo: 15,
      stockActual: 30,
      precioCompra: 25,
      precioVenta: 150,
      sucursalId: santaCruz.id,
    },
    {
      codigo: 'EMP-FILT',
      nombre: 'Empaque de filtro',
      categoria: 'Empaques',
      stockMinimo: 30,
      stockActual: 50,
      precioCompra: 3,
      precioVenta: 9,
      sucursalId: santaCruz.id,
    },
    {
      codigo: 'CHI-FRENO',
      nombre: 'Chicote de freno universal',
      categoria: 'Chicotes',
      stockMinimo: 10,
      stockActual: 15,
      precioCompra: 45,
      precioVenta: 80,
      sucursalId: santaCruz.id,
    },
  ]

  for (const producto of productos) {
    await prisma.producto.upsert({
      where: { codigo: producto.codigo },
      update: {},
      create: producto,
    })
  }

  console.log(`✅ ${productos.length} productos creados`)

 // ============================================
  // 7. MECÁNICOS
  // ============================================
  console.log('👨‍🔧 Creando mecánicos...')

  const mecanicos = [
    {
      nombre: 'Carlos López',
      telefono: '9991111111',
      email: 'carlos.lopez@cchtaller.com',
      sucursalId: santaCruz.id,
      porcentajeComision: 15,
    },
    {
      nombre: 'Juan Martínez',
      telefono: '9992222222',
      email: 'juan.martinez@cchtaller.com',
      sucursalId: santaCruz.id,
      porcentajeComision: 15,
    },
    {
      nombre: 'Pedro Hernández',
      telefono: '9993333333',
      email: 'pedro.hernandez@cchtaller.com',
      sucursalId: caucel.id,
      porcentajeComision: 15,
    },
  ]

  for (const mecanico of mecanicos) {
    await prisma.mecanico.create({
      data: mecanico,
    })
  }

  console.log(`✅ ${mecanicos.length} mecánicos creados`)

  // ============================================
  // 8. CLIENTES Y MOTOCICLETAS
  // ============================================
  console.log('👥 Creando clientes...')

  const juan = await prisma.cliente.upsert({
    where: { telefono: '9991234567' },
    update: {},
    create: {
      nombre: 'Juan Pérez García',
      telefono: '9991234567',
      email: 'juan.perez@email.com',
      direccion: 'Calle 45 #123, Colonia Centro',
      sucursalId: santaCruz.id,
      activo: true,
    },
  })

  const maria = await prisma.cliente.upsert({
    where: { telefono: '9997654321' },
    update: {},
    create: {
      nombre: 'María López Hernández',
      telefono: '9997654321',
      email: 'maria.lopez@email.com',
      direccion: 'Calle 23 #456, Fraccionamiento Norte',
      sucursalId: santaCruz.id,
      activo: true,
    },
  })

  const yamahaR15Modelo = await prisma.modeloMoto.findFirst({
    where: { nombre: 'R15' },
  })

  const hondaCBRModelo = await prisma.modeloMoto.findFirst({
    where: { nombre: 'CBR 250R' },
  })

  console.log('🏍️ Creando motocicletas...')

  await prisma.motocicleta.upsert({
    where: {
      clienteId_placa: {
        clienteId: juan.id,
        placa: 'YUC-1234',
      },
    },
    update: {},
    create: {
      clienteId: juan.id,
      modeloMotoId: yamahaR15Modelo?.id,
      year: 2022,
      placa: 'YUC-1234',
      color: 'Azul',
      cilindrada: '150cc',
      kilometraje: 15000,
      activo: true,
    },
  })

  await prisma.motocicleta.upsert({
    where: {
      clienteId_placa: {
        clienteId: maria.id,
        placa: 'YUC-5678',
      },
    },
    update: {},
    create: {
      clienteId: maria.id,
      modeloMotoId: hondaCBRModelo?.id,
      year: 2021,
      placa: 'YUC-5678',
      color: 'Roja',
      cilindrada: '250cc',
      kilometraje: 8500,
      activo: true,
    },
  })

  console.log('✅ Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })