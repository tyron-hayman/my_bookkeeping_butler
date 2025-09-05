"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CircleArrowDown } from "lucide-react";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [movieData, setMovieData] = useState<MovieDataSingle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const listClass =
    "border-1 border-amber-500 border-solid rounded-full px-4 py-2 text-white text-lg";
  const bgVariants = {
    initial: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 0.5,
      scale: 1,
      transition: { duration: 1, easing: "easeOut" },
    },
  };

  const contentVariants = {
    visible: (index: number) => ({
      opacity: 1,
      transition: { delay: index * 0.1, duration: 1, easing: "easeOut" },
    }),
    hidden: { opacity: 0 },
    exit: (index: number) => ({
      opacity: 0,
      transition: { delay: index * 0.1, duration: 1, easing: "easeOut" },
    }),
  };

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movie = await fetch(`/api/getTargetMovie?movieid=${id}`);
        const data = await movie.json();

        if (data.data.status_code == 34) {
          router.push("/");
        }

        setMovieData(data.data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, []);

  const formatDate = (thedate: string) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const date = new Date(thedate);
    return months[date.getMonth()] + " " + date.getFullYear();
  };

  return (
    <main className="relative">
      {!isLoading ? (
        <>
          {movieData ? (
            <>
              <div className="fixed overflow-hidden inset-x-0 bottom-0 top-0 z-[0]">
                <motion.div
                  className="absolute inset-x-0 bottom-0 top-0 z-[1] !bg-cover"
                  variants={bgVariants}
                  initial="initial"
                  animate="visible"
                  style={{
                    background: `url(https://image.tmdb.org/t/p/w1920/${movieData.backdrop_path}) center center no-repeat`,
                  }}
                ></motion.div>
              </div>
              <div className="w-full relative z-[1] px-10 h-screen min-h-screen flex items-end">
                <motion.div
                  className="mb-10"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                >
                  <h1 className="text-[10lvw] leading-[1] text-amber-500 font-black uppercase">
                    {movieData.original_title}
                  </h1>
                  <p className="text-[4lvw] text-white font-normal leading-snug">
                    {movieData.tagline}
                  </p>
                </motion.div>
                <div className="absolute right-10 bottom-10 z-[2]">
                  <CircleArrowDown
                    className="animate-bounce"
                    size={64}
                    color="#ffffff"
                  />
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p className="text-white">loading</p>
      )}
    </main>
  );
}
