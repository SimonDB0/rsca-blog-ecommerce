import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 📌 Création des utilisateurs
    const users = [];
    for (let i = 0; i < 10; i++) {
        users.push(
            await prisma.user.create({
                data: {
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                },
            })
        );
    }

    // 📌 Création des catégories
    const categories = [];
    const categoryNames = ["Football", "Mercato", "Matchs", "Historique"];
    for (const name of categoryNames) {
        categories.push(
            await prisma.category.create({
                data: { name },
            })
        );
    }

    // 📌 Création des articles
    const posts = [];
    for (let i = 0; i < 20; i++) {
        posts.push(
            await prisma.post.create({
                data: {
                    title: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(3),
                    published: faker.datatype.boolean(),
                    authorId: users[Math.floor(Math.random() * users.length)].id,
                    categoryId: categories[Math.floor(Math.random() * categories.length)].id,
                },
            })
        );
    }

    // 📌 Ajout de tags et relation Post-Tag
    const tags = ["Anderlecht", "Championnat", "Transfert", "Ligue", "Europe"];
    for (const tag of tags) {
        const createdTag = await prisma.tag.create({ data: { name: tag } });

        for (const post of posts.slice(0, Math.floor(posts.length / 2))) {
            await prisma.postTag.create({
                data: {
                    postId: post.id,
                    tagId: createdTag.id,
                },
            });
        }
    }

    // 📌 Création des commentaires
    for (let i = 0; i < 50; i++) {
        await prisma.comment.create({
            data: {
                content: faker.lorem.sentence(),
                postId: posts[Math.floor(Math.random() * posts.length)].id,
                authorId: users[Math.floor(Math.random() * users.length)].id,
            },
        });
    }

    // 📌 Création des produits pour l’e-commerce
    for (let i = 0; i < 15; i++) {
        await prisma.product.create({
            data: {
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                price: parseFloat(faker.commerce.price({ min: 10, max: 200, dec: 2 })),
                stock: faker.number.int({ min: 0, max: 100 }),
            },
        });
    }

    console.log("✅ Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
