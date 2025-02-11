import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Récupérer tous les tags
export async function GET() {
    const tags = await prisma.tag.findMany();
    return NextResponse.json(tags);
}

// Ajouter un tag à un post
export async function POST(req: Request) {
    const { name, postId } = await req.json();

    if (!name || !postId) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    let tag = await prisma.tag.findUnique({ where: { name } });

    if (!tag) {
        tag = await prisma.tag.create({ data: { name } });
    }

    await prisma.postTag.create({
        data: { postId, tagId: tag.id },
    });

    return NextResponse.json(tag);
}
