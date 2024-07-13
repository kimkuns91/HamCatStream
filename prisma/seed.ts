// prisma/seed.ts
const { PrismaClient, ContentType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.content.create({
    data: {
      title: "슈가슈가룬",
      description: "슈가슈가룬 설명입니다.",
      url: "",
      uploadDate: new Date(),
      duration: 0,
      resolution: "1080p",
      tags: ["애니메이션", "판타지", "슈가슈가룬"],
      type: "SERIES",
      posterUrl: "https://storage.googleapis.com/white_mouse_dev/posters/sugarsugarrune/main.png", // 콘텐츠 포스터 이미지 URL
      episodes: {
        create: [
          {
            title: "슈가슈가룬 1화",
            description: "슈가슈가룬 1화의 설명입니다.",
            url: "https://storage.googleapis.com/white_mouse_dev/sugarsugarrune/01.mp4",
            uploadDate: new Date(),
            duration: 0,
            resolution: "1080p",
            tags: ["애니메이션", "판타지", "슈가슈가룬"],
            season: 1,
            episode: 1,
            posterUrl: "https://storage.googleapis.com/white_mouse_dev/posters/sugarsugarrune/01.png" // 에피소드 포스터 이미지 URL
          },
          {
            title: "슈가슈가룬 2화",
            description: "슈가슈가룬 2화의 설명입니다.",
            url: "https://storage.googleapis.com/white_mouse_dev/sugarsugarrune/02.mp4",
            uploadDate: new Date(),
            duration: 0,
            resolution: "1080p",
            tags: ["애니메이션", "판타지", "슈가슈가룬"],
            season: 1,
            episode: 2,
            posterUrl: "https://storage.googleapis.com/white_mouse_dev/posters/sugarsugarrune/02.png" // 에피소드 포스터 이미지 URL
          },
          // 다른 에피소드들도 여기에 추가
        ],
      },
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