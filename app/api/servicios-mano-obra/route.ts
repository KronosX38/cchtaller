// app/api/servicios-mano-obra/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar servicios de mano de obra
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')

    const servicios = await prisma.servicioManoObra.findMany({
      where: {
        activo: true,
        ...(categoria && { categoria }),
      },
      orderBy: [
        { categoria: 'asc' },
        { nombre: 'asc' },
      ],
    })

    return NextResponse.json(servicios)
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    return NextResponse.json(
      { error: 'Error al obtener servicios' },
      { status: 500 }
    )
  }
}

// POST - Crear servicio de mano de obra
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const servicio = await prisma.servicioManoObra.create({
      data: {
        categoria: body.categoria,
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        precioSemiautomatica: parseFloat(body.precioSemiautomatica),
        precioMontoneta: parseFloat(body.precioMontoneta),
        precioUrbana: parseFloat(body.precioUrbana),
        precioUrbanaGrande: parseFloat(body.precioUrbanaGrande),
        precioTrabajo: parseFloat(body.precioTrabajo),
        aumentoAnual: body.aumentoAnual ? parseFloat(body.aumentoAnual) : 0.31,
      },
    })

    return NextResponse.json(servicio, { status: 201 })
  } catch (error) {
    console.error('Error al crear servicio:', error)
    return NextResponse.json(
      { error: 'Error al crear servicio' },
      { status: 500 }
    )
  }
}