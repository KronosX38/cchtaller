// app/api/modelos-motos/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar modelos de motos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const marcaId = searchParams.get('marcaId')

    const modelos = await prisma.modeloMoto.findMany({
      where: {
        activo: true,
        ...(marcaId && { marcaId }),
      },
      include: {
        marca: true,
        familia: true,
      },
      orderBy: [
        { marca: { nombre: 'asc' } },
        { familia: { nombre: 'asc' } },
        { nombre: 'asc' },
      ],
    })

    return NextResponse.json(modelos)
  } catch (error) {
    console.error('Error al obtener modelos:', error)
    return NextResponse.json(
      { error: 'Error al obtener modelos' },
      { status: 500 }
    )
  }
}

// POST - Crear modelo de moto
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const modelo = await prisma.modeloMoto.create({
      data: {
        marcaId: body.marcaId,
        familiaId: body.familiaId || null,
        nombre: body.nombre,
        cilindrada: body.cilindrada || null,
        categoria: body.categoria || null,
        precioMantenimiento1: body.precioMantenimiento1
          ? parseFloat(body.precioMantenimiento1)
          : null,
        precioMantenimiento2: body.precioMantenimiento2
          ? parseFloat(body.precioMantenimiento2)
          : null,
        precioMantenimiento3: body.precioMantenimiento3
          ? parseFloat(body.precioMantenimiento3)
          : null,
        conGarantia: body.conGarantia ?? true,
        diasGarantia: body.diasGarantia || 30,
      },
      include: {
        marca: true,
        familia: true,
      },
    })

    return NextResponse.json(modelo, { status: 201 })
  } catch (error) {
    console.error('Error al crear modelo:', error)
    return NextResponse.json(
      { error: 'Error al crear modelo' },
      { status: 500 }
    )
  }
}