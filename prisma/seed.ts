// prisma/seed.ts
const { PrismaClient, ContentType } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create Director
  const director = await prisma.director.create({
    data: { name: "웨스 볼" },
  });

  // Create Actors
  const actors = ["오웬 티그", "프레이아 앨런", "케빈 듀랜드", "피터 메이컨", "윌리엄 H. 메이시"];
  const actorRecords = [];

  for (const actorName of actors) {
    const actor = await prisma.actor.create({
      data: { name: actorName },
    });
    actorRecords.push(actor);
  }

  // Create Genres
  const genres = ["SF", '모험', '액션'];
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
      title: "혹성탈출: 새로운 시대",
      description: "진화한 유인원과 퇴화된 인간들이 살아가는 땅. 유인원 리더 프록시무스는 완전한 군림을 위해 인간들을 사냥하며 자신의 제국을 건설한다. 한편, 또 다른 유인원 노아는 우연히 숨겨진 과거의 이야기와 시저의 가르침을 듣게 되고 인간과 유인원이 함께 할 새로운 세상을 꿈꾼다. 어느 날 그의 앞에 나타난 의문의 한 인간 소녀. 노아는 그녀와 함께 자유를 향한 여정을 시작하게 되는데…",
      videoUrl: "https://storage.googleapis.com/white_mouse_dev/videos/movies/kingdomoftheplanetoftheapes/kingdomoftheplanetoftheapes.mp4",
      trailerUrl: "https://storage.googleapis.com/white_mouse_dev/videos/movies/kingdomoftheplanetoftheapes/kingdomoftheplanetoftheapes.mp4",
      uploadDate: new Date(),
      releaseDate: new Date("2024-05-08"),
      duration: 145, // '1시간 49분'은 109분
      resolution: "FHD",
      adult: false,
      originalLanguage: "Korean",
      backdropUrl: "https://storage.googleapis.com/white_mouse_dev/images/movies/kingdomoftheplanetoftheapes/kingdomoftheplanetoftheapes-backdrop.webp",
      posterUrl: "https://storage.googleapis.com/white_mouse_dev/images/movies/kingdomoftheplanetoftheapes/kingdomoftheplanetoftheapes-poster.webp",
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
      tags: ["2024", "SF", '모험', '액션'],
      popularity: 0.0, // 기본값
      voteAverage: 0.0, // 기본값
      voteCount: 0, // 기본값
    },
  });

  console.log("영화 '혹성탈출'가 데이터베이스에 추가되었습니다.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
