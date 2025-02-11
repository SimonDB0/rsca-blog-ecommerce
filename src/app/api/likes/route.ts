import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Ajouter un like à un post ou un commentaire
export async function POST(req: Request) {
    const { userId, postId, commentId } = await req.json();

    if (!userId || (!postId && !commentId)) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    try {
        const like = await prisma.like.create({
            data: { userId, postId, commentId },
        });
        return NextResponse.json(like);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }
}

// Supprimer un like (toggle like)
export async function DELETE(req: Request) {
    const { userId, postId, commentId } = await req.json();

    if (!userId || (!postId && !commentId)) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await prisma.like.deleteMany({
        where: { userId, postId, commentId },
    });

    return NextResponse.json({ message: "Like removed" });
}
