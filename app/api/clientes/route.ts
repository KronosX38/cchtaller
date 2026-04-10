// app/api/clientes/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar clientes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const sucursalId = searchParams.get('sucursalId')
    const activo = searchParams.get('activo')

    const clientes = await prisma.cliente.findMany({
      where: {
        ...(activo && { activo: activo === 'true' }),
        ...(sucursalId && { sucursalId }),
        ...(search && {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { telefono: { contains: search } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        sucursal: {
          select: {
            id: true,
            nombre: true,
          },
        },
        motocicletas: {
          where: {
            activo: true,
          },
          include: {
            modeloMoto: {
              include: {
                marca: true,
                familia: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    )
  }
}

// POST - Crear cliente
export async function POST(request: Request) {
  try {
    const body = await request.json()

const cliente = await prisma.cliente.create({
  data: {
    nombre: body.nombre,
    telefono: body.telefono,
    email: body.email || null,
    direccion: body.direccion || null,
    sucursalId: body.sucursalId,
  },
  include: {
    sucursal: true,
  },
})

    return NextResponse.json(cliente, { status: 201 })
  } catch (error) {
    console.error('Error al crear cliente:', error)
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    )
  }
}