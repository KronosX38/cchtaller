// app/api/motocicletas/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar motocicletas (por cliente si se especifica)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clienteId = searchParams.get('clienteId')

    const motocicletas = await prisma.motocicleta.findMany({
      where: {
        activo: true,
        ...(clienteId && { clienteId }),
      },
      include: {
        cliente: {
          select: {
            nombre: true,
            telefono: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(motocicletas)
  } catch (error) {
    console.error('Error al obtener motocicletas:', error)
    return NextResponse.json(
      { error: 'Error al obtener motocicletas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva motocicleta
export async function POST(request: Request) {
  try {
    const body = await request.json()

   const motocicleta = await prisma.motocicleta.create({
  data: {
    clienteId: body.clienteId,
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
  },
  include: {
    modeloMoto: {
      include: {
        marca: true,
        familia: true,
      },
    },
  },
})

    return NextResponse.json(motocicleta, { status: 201 })
  } catch (error) {
    console.error('Error al crear motocicleta:', error)
    return NextResponse.json(
      { error: 'Error al crear motocicleta' },
      { status: 500 }
    )
  }
}