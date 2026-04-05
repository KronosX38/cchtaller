// app/api/sucursales/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sucursales = await prisma.sucursal.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
    })

    return NextResponse.json(sucursales)
  } catch (error) {
    console.error('Error al obtener sucursales:', error)
    return NextResponse.json(
      { error: 'Error al obtener sucursales' },
      { status: 500 }
    )
  }
}