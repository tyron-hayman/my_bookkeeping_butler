"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "@/contexts/PageTransition";
import GlobalNav from "@/components/GlobalNav";
import loadingStore from "@/stores/loadingStore";
import HomeScene from "@/components/scenes/HomeScene";

export default function Home() {
  const [movieData, setMovieData] = useState<GlobalMovieArr | null>(null);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const globalLoadingDone = loadingStore((state) => state.setLoadingDone);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movies = await fetch("/api/getAllMovies");
        const data = await movies.json();
        setMovieData(data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(() => {
          globalLoadingDone();
        }, 1000);
      }
    };

    getMovies();
  }, []);

  return (
    <main className="min-h-screen relative">
      <HomeScene />
      <div className="w-full min-h-screen relative z-[2] p-4 flex items-center justify-center">
        <div
          className="container flex flex-nowrap gap-4"
          onMouseLeave={() => setActiveTitle(null)}
        >
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
                            setTitle={setActiveTitle}
                          />
                        );
                      })}
                  </>
                ) : null}
              </>
            ) : null}
          </>
        </div>
      </div>
      <div className="fixed inset-x-0 top-32 z-[3] pointer-events-none">
        {activeTitle ? (
          <AnimatePresence>
            <motion.h2
              key={activeTitle}
              className="text-amber-400 text-5xl leading-[1] font-black uppercase text-center block absolute bottom-0 left-0 w-full"
              initial={{ y: 10, filter: "blur(8px)", opacity: 0 }}
              animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
              exit={{ y: 10, filter: "blur(8px)", opacity: 0 }}
            >
              {activeTitle}
            </motion.h2>
          </AnimatePresence>
        ) : null}
      </div>
      <GlobalNav />
    </main>
  );
}

const MovieSlide = ({
  id,
  title,
  poster_path,
  layer,
  setTitle,
}: {
  id: number;
  title: string;
  poster_path: string;
  layer: number;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { navigate } = useTransition();
  const styles = {
    background: `url(https://image.tmdb.org/t/p/w1920/${poster_path}) center center no-repeat`,
    zIndex: layer,
  };
  const variants = {
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, easing: "easeInOut" },
    }),
    hidden: { opacity: 0, y: 200 },
    exit: (index: number) => ({
      opacity: 0,
      y: 200,
      transition: { delay: index * 0.1, duration: 0.5, easing: "anticipate" },
    }),
  };

  const goToMovie = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    movie_id: number
  ): void => {
    e.preventDefault();
    navigate(`/movie/${movie_id}`);
    console.log(movie_id);
  };
  return (
    <motion.div
      className="grow h-[50lvh] aspect-[9/16] !bg-cover border-1 border-white/5 border-solid relative group cursor-pointer rounded-2xl overflow-hidden"
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.1 }}
      custom={layer}
      onClick={(e) => goToMovie(e, id)}
      onMouseEnter={() => setTitle(title)}
    >
      <div
        className="absolute inset-0 !bg-cover z-[1] saturate-0 opacity-30"
        style={styles}
      ></div>
      <div
        className="absolute inset-y-0 !bg-cover z-[2] left-[50%] w-[0%] transition-all duration-500 group-hover:w-[100%] group-hover:left-[0%] group-hover:scale-110"
        style={styles}
      ></div>
    </motion.div>
  );
};
