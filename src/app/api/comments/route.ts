import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Récupérer les commentaires d'un post
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) return NextResponse.json({ error: "postId is required" }, { status: 400 });

    const comments = await prisma.comment.findMany({
        where: { postId },
        include: { author: true },
    });

    return NextResponse.json(comments);
}

// Ajouter un commentaire
export async function POST(req: Request) {
    const { content, postId, authorId } = await req.json();

    if (!content || !postId || !authorId) return NextResponse.json({ error: "Invalid data" }, { status: 400 });

    const comment = await prisma.comment.create({
        data: { content, postId, authorId },
    });

    return NextResponse.json(comment);
}
