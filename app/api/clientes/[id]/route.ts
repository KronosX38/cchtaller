// app/api/clientes/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener un cliente específico
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // ← CAMBIO AQUÍ
    
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        sucursal: true,
        motocicletas: {
          where: { activo: true },
        },
      },
    })

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error al obtener cliente:', error)
    return NextResponse.json(
      { error: 'Error al obtener cliente' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // ← CAMBIO AQUÍ
    const body = await request.json()

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre: body.nombre,
        telefono: body.telefono,
        email: body.email || null,
        direccion: body.direccion || null,
        notas: body.notas || null,
        sucursalId: body.sucursalId,
      },
      include: {
        sucursal: {
          select: {
            nombre: true,
          },
        },
      },
    })

    return NextResponse.json(cliente)
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
    return NextResponse.json(
      { error: 'Error al actualizar cliente' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cliente (soft delete)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // ← CAMBIO AQUÍ
    
    await prisma.cliente.update({
      where: { id },
      data: { activo: false },
    })

    return NextResponse.json({ message: 'Cliente eliminado' })
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
    return NextResponse.json(
      { error: 'Error al eliminar cliente' },
      { status: 500 }
    )
  }
}