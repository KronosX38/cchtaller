// app/api/motocicletas/[id]/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener una motocicleta específica
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const motocicleta = await prisma.motocicleta.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
    })

    if (!motocicleta) {
      return NextResponse.json(
        { error: 'Motocicleta no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(motocicleta)
  } catch (error) {
    console.error('Error al obtener motocicleta:', error)
    return NextResponse.json(
      { error: 'Error al obtener motocicleta' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar motocicleta
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()

const motocicleta = await prisma.motocicleta.update({
  where: { id },
  data: {
    modeloMotoId: body.modeloMotoId || null,
    marcaManual: body.marcaManual || null,
    modeloManual: body.modeloManual || null,
    placa: body.placa || null,
    year: body.year ? parseInt(body.year) : null,
    color: body.color || null,
    numeroSerie: body.numeroSerie || null,
    cilindrada: body.cilindrada || null,
    kilometraje: body.kilometraje ? parseInt(body.kilometraje) : null,
    notas: body.notas || null,
  }
})

    return NextResponse.json(motocicleta)
  } catch (error) {
    console.error('Error al actualizar motocicleta:', error)
    return NextResponse.json(
      { error: 'Error al actualizar motocicleta' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar motocicleta (soft delete)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.motocicleta.update({
      where: { id },
      data: { activo: false },
    })

    return NextResponse.json({ message: 'Motocicleta eliminada' })
  } catch (error) {
    console.error('Error al eliminar motocicleta:', error)
    return NextResponse.json(
      { error: 'Error al eliminar motocicleta' },
      { status: 500 }
    )
  }
}