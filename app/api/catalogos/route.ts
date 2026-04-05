// app/api/catalogos/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener catálogos (filtrado por tipo opcional)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    const catalogos = await prisma.catalogo.findMany({
      where: {
        activo: true,
        ...(tipo && { tipo }),
      },
      orderBy: [
        { orden: 'asc' },
        { nombre: 'asc' },
      ],
    })

    return NextResponse.json(catalogos)
  } catch (error) {
    console.error('Error al obtener catálogos:', error)
    return NextResponse.json(
      { error: 'Error al obtener catálogos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo catálogo (para módulo de configuración futuro)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const catalogo = await prisma.catalogo.create({
      data: {
        tipo: body.tipo,
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        orden: body.orden || 0,
      },
    })

    return NextResponse.json(catalogo, { status: 201 })
  } catch (error) {
    console.error('Error al crear catálogo:', error)
    return NextResponse.json(
      { error: 'Error al crear catálogo' },
      { status: 500 }
    )
  }
}