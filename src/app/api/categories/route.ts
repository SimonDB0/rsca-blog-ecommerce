import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Récupérer toutes les catégories
export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

// Ajouter une catégorie
export async function POST(req: Request) {
    const { name } = await req.json();

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const category = await prisma.category.create({ data: { name } });

    return NextResponse.json(category);
}
