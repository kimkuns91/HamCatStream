import { Prisma } from "@prisma/client";

// 확장된 Content 타입 정의
export type ContentWithRelations = Prisma.ContentGetPayload<{
  include: {
    episodes?: true;
    director: true;
    actors: {
      include: {
        actor: true;
      };
    };
    genres: {
      include: {
        genre: true;
      };
    };
    countries: {
      include: {
        country: true;
      };
    };
  };
}>;
