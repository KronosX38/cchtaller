// app/api/ordenes/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener orden por ID
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const orden = await prisma.ordenServicio.findUnique({
      where: { id },
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
        plantillaServicio: true,
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

    if (!orden) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    return NextResponse.json(orden)
  } catch (error) {
    console.error('Error al obtener orden:', error)
    return NextResponse.json(
      { error: 'Error al obtener orden' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar orden
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

    const {
      estadoOrden,
      kilometrajeSalida,
      fechaEntrega,
      observacionesMecanico,
      proximoServicioKm,
      proximoServicioFecha,
    } = body

    const orden = await prisma.ordenServicio.update({
      where: { id },
      data: {
        ...(estadoOrden && { estadoOrden }),
        ...(kilometrajeSalida && { kilometrajeSalida: parseInt(kilometrajeSalida) }),
        ...(fechaEntrega && { fechaEntrega: new Date(fechaEntrega) }),
        ...(observacionesMecanico !== undefined && { observacionesMecanico }),
        ...(proximoServicioKm && { proximoServicioKm: parseInt(proximoServicioKm) }),
        ...(proximoServicioFecha && {
          proximoServicioFecha: new Date(proximoServicioFecha),
        }),
      },
      include: {
        cliente: true,
        motocicleta: true,
        detalles: true,
        repuestos: true,
        checklist: true,
      },
    })

    return NextResponse.json(orden)
  } catch (error) {
    console.error('Error al actualizar orden:', error)
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar orden
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Obtener repuestos antes de eliminar para devolver al inventario
    const orden = await prisma.ordenServicio.findUnique({
      where: { id },
      include: {
        repuestos: true,
      },
    })

    if (!orden) {
      return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
    }

    // Devolver repuestos al inventario
    if (orden.repuestos && orden.repuestos.length > 0) {
      for (const repuesto of orden.repuestos) {
        if (repuesto.productoId) {
          await prisma.producto.update({
            where: { id: repuesto.productoId },
            data: {
              stockActual: {
                increment: repuesto.cantidad,
              },
            },
          })
        }
      }
    }

    // Eliminar orden (cascade elimina detalles, repuestos y checklist)
    await prisma.ordenServicio.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Orden eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar orden:', error)
    return NextResponse.json(
      { error: 'Error al eliminar orden' },
      { status: 500 }
    )
  }
}