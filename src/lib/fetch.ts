'use server';

import prisma from '@/lib/prisma';
import { ContentWithRelations } from '@/types/types';
import { cache } from 'react';

const isValidObjectId = (id: string): boolean => /^[0-9a-fA-F]{24}$/.test(id);

// postId로 Post 자료 가져오기
export const getContents = cache(async () => {
  const contents = await prisma.content.findMany();

  if (!contents) return [];

  return contents;
});

// postId로 Post 자료 가져오기
export const getContent = cache(async (contentId: string): Promise<ContentWithRelations | null> => {
  const content = await prisma.content.findUnique({
    where: {
      id: contentId,
    },
    include: {
      episodes: true,
      genres: {
        include: {
          genre: true,
        },
      },
      countries: {
        include: {
          country: true,
        },
      },
      actors: {
        include: {
          actor: true,
        },
      },
      director: true,
    },
  });

  if (!content) return null;

  return content;
});

export const getVideo = async (videoId: string) => {
  const video = await prisma.content.findUnique({
    where: { id: videoId },
  });

  if (video) {
    return { video, nextEpisode: null };
  }

  // Content에서 찾지 못하면 Episode에서 검색
  const episode = await prisma.episode.findUnique({
    where: { id: videoId },
  });

  if (episode) {
    // 다음 에피소드를 찾기 위해 같은 콘텐츠의 다음 에피소드를 검색
    const nextEpisode = await prisma.episode.findFirst({
      where: {
        contentId: episode.contentId,
        season: episode.season,
        episode: {
          gt: episode.episode,
        },
      },
      orderBy: {
        episode: 'asc',
      },
    });

    return { video: episode, nextEpisode };
  }

  return null;
};

// // 모든 Tags 가져오기
// export const getTags = cache(async () => {
//   try {
//     const tags = await prisma.tags.findMany();

//     if (!tags) return [];

//     return tags;
//   } catch (error) {
//     console.error('Error getTags Function :', error);
//     throw error;
//   }
// });

// // 모든 Categories 가져오기
// export const getCategories = cache(async () => {
//   try {
//     const categories = await prisma.categories.findMany();
//     if (!categories) return [];

//     return categories;
//   } catch (error) {
//     console.error('Error getCategories Function :', error);
//     throw error;
//   }
// });

// // Post의 노출 여부 변경하기
// export const handlePostPublished = async (postId: string) => {
//   try {
//     const post = await prisma.post.findUnique({
//       where: {
//         id: postId,
//       },
//     });
//     if (!post) {
//       throw new Error(`Post with ID ${postId} not found`);
//     }
//     const updatedPost = await prisma.post.update({
//       where: {
//         id: postId,
//       },
//       data: {
//         published: !post.published, // 현재 값의 반대로 설정합니다.
//       },
//     });
//     return updatedPost;
//   } catch (error) {
//     console.error('Error handlePostPublished Function:', error);
//     throw error;
//   }
// };

// // 유저 이메일 검증
// export const verifyEmail = async (userId: string) => {
//   try {
//     if (!isValidObjectId(userId)) {
//       return null; //
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (!user) {
//       return { status: 'not_found' };
//     }

//     if (user.emailVerified) {
//       return { status: 'already_verified' };
//     }

//     const result = await prisma.user.update({
//       where: {
//         id: userId,
//       },
//       data: {
//         emailVerified: new Date(),
//       },
//     });

//     return { status: 'verified', result };
//   } catch (error) {
//     console.error('Error handlePostPublished Function:', error);
//     throw error;
//   }
// };

// // 비밀번호 변경
// export const verifyChangepassword = async (id: string) => {
//   try {
//     if (!isValidObjectId(id)) {
//       return null; //
//     }

//     const result = await prisma.changepassword.findUnique({
//       where: {
//         id,
//       },
//     });

//     if (!result) {
//       return null;
//     }

//     return result.userId;

//   } catch (error) {
//     console.error('Error handlePostPublished Function:', error);
//     throw error;
//   }
// };
