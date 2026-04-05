// app/api/mecanicos/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar mecánicos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sucursalId = searchParams.get('sucursalId')

    const mecanicos = await prisma.mecanico.findMany({
      where: {
        activo: true,
        ...(sucursalId && { sucursalId }),
      },
      include: {
        sucursal: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    })

    return NextResponse.json(mecanicos)
  } catch (error) {
    console.error('Error al obtener mecánicos:', error)
    return NextResponse.json(
      { error: 'Error al obtener mecánicos' },
      { status: 500 }
    )
  }
}

// POST - Crear mecánico
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const mecanico = await prisma.mecanico.create({
      data: {
        nombre: body.nombre,
        telefono: body.telefono || null,
        email: body.email || null,
        sucursalId: body.sucursalId || null,
        porcentajeComision: body.porcentajeComision
          ? parseFloat(body.porcentajeComision)
          : null,
      },
      include: {
        sucursal: true,
      },
    })

    return NextResponse.json(mecanico, { status: 201 })
  } catch (error) {
    console.error('Error al crear mecánico:', error)
    return NextResponse.json(
      { error: 'Error al crear mecánico' },
      { status: 500 }
    )
  }
}