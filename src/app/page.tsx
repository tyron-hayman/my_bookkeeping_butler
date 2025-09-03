"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [movieData, setMovieData] = useState<GlobalMovieArr | null>(null);
  const [activeMovies, setActiveMovies] = useState<boolean>(true);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movies = await fetch("/api/getAllMovies");
        const data = await movies.json();
        setMovieData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, []);

  return (
    <main className="min-h-screen relative bg-black">
      <div className="w-full min-h-screen relative z-[2] p-4 flex items-center justify-center">
        <div
          className="container flex flex-nowrap gap-4 overflow-hidden"
          onMouseLeave={() => setActiveTitle(null)}
        >
          {isLoading ? (
            <div className="animate-pulse col-span-1 aspect-[9/16] !bg-cover rounded-3xl border-1 border-white/10 border-solid"></div>
          ) : (
            <>
              {movieData ? (
                <>
                  {movieData.results.length > 0 ? (
                    <>
                      {movieData.results
                        .slice(0, 7)
                        .map((movie: MovieData, index: number) => {
                          return (
                            <MovieSlide
                              key={movie.id}
                              {...movie}
                              layer={index}
                              active={activeMovies}
                              setActive={setActiveMovies}
                              setTitle={setActiveTitle}
                            />
                          );
                        })}
                    </>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
      {activeTitle ? (
        <div className="fixed inset-x-0 bottom-5 z-[1] flex items-center justify-center">
          <AnimatePresence>
            <motion.h2
              key={activeTitle}
              className="text-amber-500 text-[8lvw] leading-[1] font-black uppercase text-center block absolute inset-x-0 bottom-0"
              initial={{ y: 10, filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              exit={{ y: 10, filter: "blur(8px)", opacity: 0 }}
            >
              {activeTitle}
            </motion.h2>
          </AnimatePresence>
        </div>
      ) : null}
    </main>
  );
}

const MovieSlide = ({
  id,
  title,
  poster_path,
  layer,
  active,
  setActive,
  setTitle,
}: {
  id: number;
  title: string;
  poster_path: string;
  layer: number;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const styles = {
    background: `url(https://image.tmdb.org/t/p/w1920/${poster_path}) center center no-repeat`,
    zIndex: layer,
  };
  const variants = {
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, easing: "anticipate" },
    }),
    hidden: { opacity: 0, y: 100 },
    exit: (index: number) => ({
      opacity: 0,
      y: 100,
      transition: { delay: index * 0.1, duration: 0.5, easing: "anticipate" },
    }),
  };

  const goToMovie = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    movie_id: number
  ): void => {
    e.preventDefault();
    setActive(false);
    console.log(movie_id);
  };
  return (
    <motion.div
      className="grow h-[50lvh] aspect-[9/16] !bg-cover border-1 border-white/5 border-solid relative group cursor-pointer rounded-2xl overflow-hidden bg-black"
      variants={variants}
      initial="hidden"
      animate={active ? "visible" : "exit"}
      custom={layer}
      onClick={(e) => goToMovie(e, id)}
      onMouseEnter={() => setTitle(title)}
    >
      <div
        className="absolute inset-0 !bg-cover z-[1] saturate-0 opacity-30"
        style={styles}
      ></div>
      <div
        className="absolute inset-y-0 !bg-cover z-[2] left-[50%] w-[0%] transition-all duration-500 group-hover:w-[100%] group-hover:left-[0%]"
        style={styles}
      ></div>
    </motion.div>
  );
};
