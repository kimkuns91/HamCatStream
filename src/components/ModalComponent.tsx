'use client';

import { contentState, modalState } from '@/lib/state/modalAtom';
import { Content, Episode } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaPlay, FaPlus, FaThumbsUp } from 'react-icons/fa';

import { getContent } from '@/lib/fetch';
import { formatTime } from '@/lib/formatTime';
import { ContentWithRelations } from '@/types/types';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IoIosClose } from 'react-icons/io';
import { useRecoilState } from 'recoil';
import SkeletonList from './SkeletonList';
import { Button } from './ui/button';

const ModalComponent: React.FC = () => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [content] = useRecoilState<Content | null>(contentState);
  const [extendContent, setExtendContent] =
    useState<ContentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [episode, setEpisode] = useState<Episode[] | null>(null);

  const navigate = useRouter();
  const handleClose = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto'; // Enable scroll on body when modal is closed
  };

  useEffect(() => {
    if (!content) return;

    (async () => {
      try {
        setLoading(true);
        const result = await getContent(content.id);
        if (!result) return;
        setExtendContent(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [content]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'; // Disable scroll on body when modal is open
    }
  }, [showModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={handleClose}
          />
          <div className="overflow-y-auto scrollbar-hide w-[95%] md:w-[80%] max-w-[1240px] min-h-screen h-full py-20">
            <motion.div
              className="relative w-full bg-[#191919] rounded-lg shadow-lg z-10 pb-10 md:pb-20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={handleClose}
                className="absolute flex items-center justify-center top-5 right-5 w-10 h-10 z-20 bg-black rounded-full"
              >
                <IoIosClose className="text-4xl text-white font-bold" />
              </button>
              <div className="relative pt-[56.25%]">
                <Image
                  src={
                    content?.backdropUrl ||
                    content?.posterUrl ||
                    "/images/noPoster.webp"
                  }
                  fill
                  objectFit="cover"
                  alt={content?.title || 'Title'}
                  className="rounded-t-lg"
                />
                <div className="absolute flex flex-col bottom-10 w-full items-start gap-8 px-6 md:px-10">
                  {content?.titleImageUrl ? (
                    <Image
                      src={content?.titleImageUrl}
                      width={400}
                      height={250}
                      className='w-2/3 lg:w-5/12'
                      alt={content?.title}
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-gray-100 md:text-4xl lg:text-7xl">
                      {content?.title}
                    </h1>
                  )}

                  <div className="flex items-center space-x-8">
                    <Button
                      onClick={() => {
                        handleClose();
                        navigate.push(`/watch/${content?.id}`);
                      }}
                      className="flex items-center gap-x-2 rounded bg-white p-6 md:py-7 md:px-8 text-lg md:text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                    >
                      <FaPlay className="h-5 w-5 md:h-7 md:w-7 text-black" />
                      재생
                    </Button>

                    <button className="modalButton">
                      <FaPlus className="h-7 w-7" />
                    </button>

                    <button className="modalButton">
                      <FaThumbsUp className="h-7 w-7" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col mt-4 px-6 md:px-10 py-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                  <div className="flex-[2] flex flex-col gap-6">
                    {content?.tags && (
                      <ul className="flex items-center gap-4">
                        {content.tags.map((tag, index) => (
                          <li
                            key={index}
                            className="px-5 py-1 text-sm md:text-lg bg-slate-700 rounded-xl"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p
                      className="text-base text-shadow-md lg:text-lg"
                      style={{ lineHeight: '1.75' }}
                    >
                      {content?.description}
                    </p>
                  </div>
                  <div className="flex-[1] flex flex-col gap-2 text-xs text-shadow-md md:text-base lg:text-base">
                    {extendContent?.director && (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-500">감독 : </p>
                        <p>{extendContent.director.name}</p>
                      </div>
                    )}
                    {extendContent?.actors &&
                      extendContent?.actors.length > 0 && (
                        <div className="flex items-center gap-2">
                          <p className="text-gray-500">출연 : </p>
                          <p>
                            {extendContent.actors
                              .map((actor) => actor.actor.name)
                              .join(', ')}
                          </p>
                        </div>
                      )}
                    {extendContent?.genres &&
                      extendContent?.genres.length > 0 && (
                        <div className="flex items-center gap-2">
                          <p className="text-gray-500">장르 : </p>
                          <p>
                            {extendContent.genres
                              .map((genre) => genre.genre.name)
                              .join(', ')}
                          </p>
                        </div>
                      )}
                    {extendContent?.countries &&
                      extendContent?.countries.length > 0 && (
                        <div className="flex items-center gap-2">
                          <p className="text-gray-500">국가 : </p>
                          <p>
                            {extendContent.countries
                              .map((country) => country.country.name)
                              .join(', ')}
                          </p>
                        </div>
                      )}
                    {content?.releaseDate && (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-500">개봉일 : </p>
                        <p>
                          {format(
                            new Date(content?.releaseDate),
                            'yyyy년 MM월 dd일'
                          )}
                        </p>
                      </div>
                    )}
                    {content?.duration && (
                      <div className="flex items-center gap-2">
                        <p className="text-gray-500">상영 시간 : </p>
                        <p>{formatTime(content?.duration)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {content && content.type === 'SERIES' && (
                <div className="w-full mt-4 md:mt-12 px-6 md:px-10 pb-20">
                  <h4 className="text-2xl font-medium text-slate-300 mb-4 md:mb-12">
                    회차
                  </h4>
                  {loading ? (
                    <SkeletonList />
                  ) : (
                    <ul className="flex flex-col mt-2 border-t border-gray-700">
                      {extendContent?.episodes &&
                        extendContent?.episodes?.map((episode) => (
                          <li
                            key={episode.id}
                            onClick={() => {
                              handleClose();
                              navigate.push(`/watch/${episode.id}`);
                            }}
                            className="h-[50px] md:h-[200px] md:px-8 border-b border-gray-700 cursor-pointer rounded-lg flex items-center text-gray-300 hover:bg-slate-800 transition-all ease-in-out "
                          >
                            <div className="relative w-full h-[30px] md:h-[170px] flex items-center md:gap-12">
                              <p className="w-[40px] md:w-[30px] text-lg md:text-3xl text-white">
                                {episode.episode}
                              </p>
                              <div className="h-full flex gap-8 items-start">
                                <div className="h-full hidden md:flex items-center justify-center">
                                  <div className="relative w-[280px] h-[170px]">
                                    <Image
                                      src={
                                        episode.posterUrl ||
                                        '/images/noPoster.webp'
                                      }
                                      layout="fill"
                                      objectFit="cover"
                                      alt={episode.title}
                                      className="rounded"
                                      priority
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-4 items-start">
                                  <p className="text-lg md:text-xl font-medium text-white">
                                    {episode.title}
                                  </p>
                                  <p className="hidden md:block text-sm text-gray-400">
                                    {episode.description || content.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalComponent;
