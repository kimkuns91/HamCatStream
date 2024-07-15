
// prisma/seed.ts
const { PrismaClient, ContentType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create Director
  const director = await prisma.director.create({
    data: { name: "마크 딘달" },
  });
  
  // Create Actors
  const actors = ["크리스 프랫", '사무엘 L. 잭슨', '해나 워딩엄', '빙 레임스' , '니콜라스 홀트'];
  const actorRecords = [];

  for (const actorName of actors) {
    const actor = await prisma.actor.create({
      data: { name: actorName },
    });
    actorRecords.push(actor);
  }

  // Create Genres
  const genres = ["애니메이션",  '가족', '모험', '코미디'];
  const genreRecords = [];

  for (const genreName of genres) {
    let genre = await prisma.genre.findFirst({
      where: { name: genreName },
    });

    if (!genre) {
      genre = await prisma.genre.create({
        data: { name: genreName },
      });
    }

    genreRecords.push(genre);
  }

  // Create Country
  let country = await prisma.country.findFirst({
    where: { name: "USA" },
  });

  if (!country) {
    country = await prisma.country.create({
      data: { name: "USA" },
    });
  }
  
  // Create Movie (댓글부대)
  const movie = await prisma.content.create({
    data: {
      title: "가필드 더 무비",
      description: "13살이 된 라일리의 행복을 위해 매일 바쁘게 머릿속 감정 컨트롤 본부를 운영하는 ‘기쁨’, ‘슬픔’, ‘버럭’, ‘까칠’, ‘소심’. 그러던 어느 날, 낯선 감정인 ‘불안’, ‘당황’, ‘따분’, ‘부럽’이가 본부에 등장하고, 언제나 최악의 상황을 대비하며 제멋대로인 ‘불안’이와 기존 감정들은 계속 충돌한다. 결국 새로운 감정들에 의해 본부에서 쫓겨나게 된 기존 감정들은 다시 본부로 돌아가기 위해 위험천만한 모험을 시작하는데…",
      videoUrl: "https://storage.googleapis.com/white_mouse_dev/videos/movies/thegarfieldmovie/thegarfieldmovie.mp4",
      trailerUrl: "https://storage.googleapis.com/white_mouse_dev/videos/movies/thegarfieldmovie/thegarfieldmovie.mp4",
      titleImageUrl: "https://storage.googleapis.com/white_mouse_dev/images/movies/thegarfieldmovie/thegarfieldmovie-title.webp",
      uploadDate: new Date(),
      releaseDate: new Date("2024-05-15"),
      duration: 101, 
      resolution: "FHD",
      adult: false,
      originalLanguage: "English",
      backdropUrl: "https://storage.googleapis.com/white_mouse_dev/images/movies/thegarfieldmovie/thegarfieldmovie-backdrop.webp",
      posterUrl: "https://storage.googleapis.com/white_mouse_dev/images/movies/thegarfieldmovie/thegarfieldmovie-poster.webp",
      type: ContentType.MOVIE,
      director: {
        connect: { id: director.id },
      },
      actors: {
        create: actorRecords.map(actor => ({
          actor: {
            connect: { id: actor.id },
          },
        })),
      },
      genres: {
        create: genreRecords.map(genre => ({
          genre: {
            connect: { id: genre.id },
          },
        })),
      },
      countries: {
        create: {
          country: {
            connect: { id: country.id },
          },
        },
      },
      tags: ["애니메이션", '가족', '모험', '코미디'],
      popularity: 0.0, // 기본값
      voteAverage: 0.0, // 기본값
      voteCount: 0, // 기본값
    },
  });

  console.log("영화 '채승하'가 데이터베이스에 추가되었습니다.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
