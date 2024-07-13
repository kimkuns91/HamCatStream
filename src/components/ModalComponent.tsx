"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Content as ContentType, Episode } from "@prisma/client";
import { FaPlay, FaPlus, FaThumbsUp } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { contentState, modalState } from "@/lib/state/modalAtom";

import { Button } from "./ui/button";
import Image from "next/image";
import { IoIosClose } from "react-icons/io";
import SkeletonList from "./SkeletonList";
import { getContent } from "@/lib/fetch";
import { useRecoilState } from "recoil";
import { useRouter } from "next/navigation";

const ModalComponent: React.FC = () => {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [content] = useRecoilState(contentState);
  const [loading, setLoading] = useState(true);
  const [episode, setEpisode] = useState<Episode[] | null>(null);

  const navigate = useRouter();
  const handleClose = () => {
    setShowModal(false);
    document.body.style.overflow = "auto"; // Enable scroll on body when modal is closed
  };

  useEffect(() => {
    if (!content) return;

    if (content.type === "MOVIE") return;

    (async () => {
      try {
        setLoading(true);
        const result = await getContent(content.id);
        if (!result) return;
        setEpisode(result.episodes);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [content]);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scroll on body when modal is open
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
          ></div>
          <motion.div
            className="relative scrollbar-hide w-[80%] bg-[#191919] rounded-lg shadow-lg z-10 max-h-[90vh] overflow-y-auto"
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
                src={content?.posterUrl || "/images/sugar.png"}
                layout="fill"
                objectFit="cover"
                alt={content?.title || "Title"}
                className="rounded-t-lg"
              />
              <div className="absolute bottom-10 flex w-full items-center justify-between px-10">
                <div className="flex space-x-8">
                  <Button
                    onClick={() => {
                      handleClose();
                      navigate.push(`/watch/${content?.id}`);
                    }}
                    className="flex items-center gap-x-2 rounded bg-white  py-7 px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]"
                  >
                    <FaPlay className="h-7 w-7 text-black" />
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
            <div className="flex flex-col mt-4 px-8 py-8 gap-8">
              <h3 className="text-xl font-bold text-gray-100 md:text-2xl lg:text-5xl">
                {content?.title || "Title"}
              </h3>
              <p className="max-w-xs text-xs text-shadow-md md:max-w-lg md:text-lg lg:max-w-2xl lg:text-2xl">
                {content?.description}
              </p>
            </div>
            {content && content.type === "SERIES" && (
              <div className="w-full mt-12 px-8 pb-20">
                <h4 className="text-2xl font-medium text-slate-300 mb-12">
                  회차
                </h4>
                {loading ? (
                  <SkeletonList />
                ) : (
                  <ul className="flex flex-col mt-2 border-t border-gray-700">
                    {episode?.map((episode) => (
                      <li
                        key={episode.id}
                        onClick={() => {
                          handleClose();
                          navigate.push(`/watch/${episode.id}`);
                        }}
                        className="h-[200px] px-8 border-b border-gray-700 cursor-pointer rounded-lg flex items-center text-gray-300 hover:bg-slate-800 transition-all ease-in-out "
                      >
                        <div className="relative w-full h-[170px] flex items-center gap-12">
                          <p className="w-[30px] text-3xl text-white">
                            {episode.episode}
                          </p>
                          <div className="h-full flex gap-8 items-start">
                            <div className="h-full flex items-center justify-center">
                              <div className="relative w-[280px] h-[170px]">
                                <Image
                                  src={
                                    episode.posterUrl || "/images/noPoster.webp"
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
                              <p className="text-xl font-medium text-white">
                                {episode.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                {episode.description ||
                                  "No description available."}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalComponent;
