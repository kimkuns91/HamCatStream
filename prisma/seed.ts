// prisma/seed.ts
const { PrismaClient, ContentType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.content.create({
    data: {
      title: "댓글 부대",
      description: "창경일보 사회부 기자인 임상진은 대기업 만전의 비리를 취재한 기사가 오보로 몰려 정직당하고 만다. 복직을 노리던 상진은 댓글부대 팀 알렙에 대한 제보를 받게 된다.",
      url: "https://storage.googleapis.com/white_mouse_dev/videos/trollfactory/Troll_Factory.mp4",
      uploadDate: new Date(),
      duration: 0,
      resolution: "1080p",
      tags: [" 범죄", "드라마"],
      type: "MOVIE",
      posterUrl: "https://storage.googleapis.com/white_mouse_dev/posters/trollfactory/01.webp", 
    },
  });

  console.log("데이터베이스에 시드 데이터가 추가되었습니다.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });