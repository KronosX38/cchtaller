// app/api/productos/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar productos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const sucursalId = searchParams.get('sucursalId')
    const stockBajo = searchParams.get('stockBajo') === 'true'

    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        ...(categoria && { categoria }),
        ...(sucursalId && { sucursalId }),
        ...(stockBajo && {
          stockActual: {
            lte: prisma.producto.fields.stockMinimo,
          },
        }),
      },
      include: {
        sucursal: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    })

    return NextResponse.json(productos)
  } catch (error) {
    console.error('Error al obtener productos:', error)
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

// POST - Crear producto
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const producto = await prisma.producto.create({
      data: {
        codigo: body.codigo || null,
        nombre: body.nombre,
        descripcion: body.descripcion || null,
        categoria: body.categoria,
        marca: body.marca || null,
        stockMinimo: parseInt(body.stockMinimo) || 5,
        stockActual: parseInt(body.stockActual) || 0,
        precioCompra: parseFloat(body.precioCompra),
        precioVenta: parseFloat(body.precioVenta),
        sucursalId: body.sucursalId || null,
      },
      include: {
        sucursal: true,
      },
    })

    return NextResponse.json(producto, { status: 201 })
  } catch (error) {
    console.error('Error al crear producto:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}