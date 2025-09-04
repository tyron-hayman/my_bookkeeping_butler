"use client";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [movieData, setMovieData] = useState<MovieDataSingle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const bgVariants = {
    initial: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 0.5,
      scale: 1,
      transition: { duration: 1, easing: "easeOut" },
    },
  };

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movie = await fetch(`/api/getTargetMovie?movieid=${id}`);
        const data = await movie.json();
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
    <main className="min-h-screen relative">
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
              <div className="relative z-[1]">
                <div className="w-full px-20 pt-30">
                  <h1 className="text-8xl leading-[1] text-amber-500 font-black uppercase">
                    {movieData.original_title}
                  </h1>
                </div>
                <div className="pt-20 pb-40 w-full px-20 flex items-start justify-between">
                  <div className="w-1/3">
                    <h2 className="text-white text-4xl font-black uppercase">
                      Release
                    </h2>
                    <p className="text-stone-600 text-4xl">
                      {formatDate(movieData.release_date)}
                    </p>
                  </div>
                </div>
                <div className="w-1/3 mx-auto">
                  <p className="text-white text-3xl font-normal leading-relaxed">
                    {movieData.overview}
                  </p>
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
