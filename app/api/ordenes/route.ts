// app/api/ordenes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar órdenes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')
    const motocicletaId = searchParams.get('motocicletaId')
    const estadoOrden = searchParams.get('estadoOrden')

    const ordenes = await prisma.ordenServicio.findMany({
      where: {
        ...(clienteId && { clienteId }),
        ...(motocicletaId && { motocicletaId }),
        ...(estadoOrden && { estadoOrden }),
      },
      include: {
        cliente: true,
        motocicleta: {
          include: {
            modeloMoto: {
              include: {
                marca: true,
                familia: true,
              },
            },
          },
        },
        sucursal: true,
        mecanico: true,
        detalles: {
          include: {
            servicioManoObra: true,
          },
        },
        repuestos: {
          include: {
            producto: true,
          },
        },
        checklist: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    })

    return NextResponse.json(ordenes)
  } catch (error) {
    console.error('Error al obtener órdenes:', error)
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    )
  }
}

// POST - Crear orden
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      clienteId,
      motocicletaId,
      sucursalId,
      mecanicoId,
      plantillaServicioId,
      tipoServicio,
      kilometrajeEntrada,
      nivelCombustible,
      detalles, // Array de trabajos de mano de obra
      repuestos, // Array de repuestos usados
      checklist, // Array de items del checklist
      metodoPago,
      conGarantia,
      diasGarantia,
      observacionesCliente,
      observacionesMecanico,
      mostrarDesglose,
    } = body

    // Generar número de orden (último + 1)
    const ultimaOrden = await prisma.ordenServicio.findFirst({
      orderBy: { numero: 'desc' },
    })
    const siguienteNumero = ultimaOrden
      ? (parseInt(ultimaOrden.numero) + 1).toString()
      : '2948'

    // Calcular totales
    let subtotalManoObra = 0
    let subtotalRepuestos = 0

    if (detalles && detalles.length > 0) {
      subtotalManoObra = detalles.reduce(
        (sum: number, detalle: any) => sum + parseFloat(detalle.subtotal),
        0
      )
    }

    if (repuestos && repuestos.length > 0) {
      subtotalRepuestos = repuestos.reduce(
        (sum: number, repuesto: any) => sum + parseFloat(repuesto.subtotal),
        0
      )
    }

    const subtotal = subtotalManoObra + subtotalRepuestos
    const iva = subtotal * 0.16
    const total = subtotal + iva

    // Crear orden con relaciones
    const orden = await prisma.ordenServicio.create({
      data: {
        numero: siguienteNumero,
        clienteId,
        motocicletaId,
        sucursalId,
        mecanicoId: mecanicoId || null,
        plantillaServicioId: plantillaServicioId || null,
        tipoServicio,
        kilometrajeEntrada: kilometrajeEntrada ? parseInt(kilometrajeEntrada) : null,
        nivelCombustible: nivelCombustible || null,
        subtotalManoObra,
        subtotalRepuestos,
        subtotal,
        iva,
        total,
        metodoPago: metodoPago || null,
        conGarantia: conGarantia ?? true,
        diasGarantia: diasGarantia || 30,
        observacionesCliente: observacionesCliente || null,
        observacionesMecanico: observacionesMecanico || null,
        mostrarDesglose: mostrarDesglose ?? false,
        estadoOrden: 'recibida',
        // Crear detalles de mano de obra
        ...(detalles &&
          detalles.length > 0 && {
            detalles: {
              create: detalles.map((detalle: any) => ({
                servicioManoObraId: detalle.servicioManoObraId || null,
                descripcion: detalle.descripcion,
                cantidad: detalle.cantidad || 1,
                precioUnitario: parseFloat(detalle.precioUnitario),
                subtotal: parseFloat(detalle.subtotal),
              })),
            },
          }),
        // Crear repuestos
        ...(repuestos &&
          repuestos.length > 0 && {
            repuestos: {
              create: repuestos.map((repuesto: any) => ({
                productoId: repuesto.productoId || null,
                descripcion: repuesto.descripcion,
                cantidad: repuesto.cantidad,
                precioCompra: parseFloat(repuesto.precioCompra),
                precioVenta: parseFloat(repuesto.precioVenta),
                subtotal: parseFloat(repuesto.subtotal),
              })),
            },
          }),
        // Crear checklist
        ...(checklist &&
          checklist.length > 0 && {
            checklist: {
              create: checklist.map((item: any) => ({
                item: item.item,
                estado: item.estado,
                observacion: item.observacion || null,
              })),
            },
          }),
      },
      include: {
        cliente: true,
        motocicleta: {
          include: {
            modeloMoto: {
              include: {
                marca: true,
                familia: true,
              },
            },
          },
        },
        detalles: {
          include: {
            servicioManoObra: true,
          },
        },
        repuestos: {
          include: {
            producto: true,
          },
        },
        checklist: true,
      },
    })

    // Descontar repuestos del inventario
    if (repuestos && repuestos.length > 0) {
      for (const repuesto of repuestos) {
        if (repuesto.productoId) {
          await prisma.producto.update({
            where: { id: repuesto.productoId },
            data: {
              stockActual: {
                decrement: repuesto.cantidad,
              },
            },
          })
        }
      }
    }

    return NextResponse.json(orden, { status: 201 })
  } catch (error) {
    console.error('Error al crear orden:', error)
    return NextResponse.json(
      { error: 'Error al crear orden' },
      { status: 500 }
    )
  }
}