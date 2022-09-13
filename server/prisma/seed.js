import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const ivan = await prisma.user.create({data: {name: 'Ivan'}});
    const mike = await prisma.user.create({data: {name: 'Mike'}});

    const post1 = await prisma.post.create({
      data: {
        body: "Lorem Ipsum - это текст-рыба, часто используемый в печати и вэб-дизайне. Lorem Ipsum является стандартной рыбой для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн. Его популяризации в новое время послужили публикация листов Letraset с образцами Lorem Ipsum в 60-х годах и, в более недавнее время, программы электронной вёрстки типа Aldus PageMaker, в шаблонах которых используется Lorem Ipsum.",
        title: 'Lorem ipsum from first post'
      }
    });

    const post2 = await prisma.post.create({
      data: {
        body: 'Lorem ipsum and test creating new post from prisma',
        title: 'Title from second post'
      }
    });

    const comment1 = await prisma.comment.create({
      data: {
        message: 'Message from fist comment',
        userId: ivan.id,
        postId: post1.id
      }
    });

    const comment2 = await prisma.comment.create({
      data: {
        message: 'Message text from second comment',
        postId: post1.id,
        userId: mike.id
      }
    });

    const comment3 = await prisma.comment.create({
      data: {
        message: 'Message text from third comment',
        postId: post2.id,
        userId: ivan.id
      }
    });
  } catch (error) {
    console.log('Prisma seed error');
  }
}

seed();