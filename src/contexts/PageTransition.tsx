"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

type TransitionContextType = {
  isTransitioning: boolean;
  navigate: (url: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  navigate: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (url: string) => {
    setIsTransitioning(true);

    // delay before pushing route
    setTimeout(() => {
      router.push(url);
      setIsTransitioning(false); // or wait for router.events if you prefer
    }, 800); // 800ms delay for animation
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, navigate }}>
      {children}
      {/* Animated overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="transition-overlay"
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          ></motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}
