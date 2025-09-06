"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function MovieCredits({ id }: { id: number }) {
  const [creditData, setCreditData] = useState<MovieCredits | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const imageVariants = {
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 1, easing: "easeOut" },
    }),
    hidden: { opacity: 0, y: 200 },
    exit: (index: number) => ({
      opacity: 0,
      y: 200,
      transition: { delay: index * 0.25, duration: 1, easing: "easeOut" },
    }),
  };

  useEffect(() => {
    const getMovies = async () => {
      try {
        const movie = await fetch(`/api/getCredits?movieid=${id}`);
        const data = await movie.json();
        setCreditData(data.data);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getMovies();
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {isLoading ? (
        <></>
      ) : (
        <div className="flex gap-4">
          {creditData && creditData.cast.length > 0 ? (
            <>
              {creditData.cast.slice(0, 8).map((cast: Cast, index: number) => {
                return (
                  <motion.div
                    key={cast.id}
                    className="w-[75px] group"
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    custom={index}
                    viewport={{ once: true }}
                  >
                    <div className="w-full aspect-[9/16] rounded-3xl overflow-hidden relative saturate-0">
                      <Image
                        src={`https://image.tmdb.org/t/p/h632${cast.profile_path}`}
                        style={{
                          objectFit: "cover",
                        }}
                        width={500}
                        height={500}
                        alt={`Profile image of ${cast.name}`}
                        priority={true}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </>
          ) : (
            <p>Cast could not be found for this movie.</p>
          )}
        </div>
      )}
    </div>
  );
}
