import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    const { name, description, price, stock } = await req.json();
    const product = await prisma.product.create({
        data: { name, description, price, stock },
    });
    return NextResponse.json(product);
}
