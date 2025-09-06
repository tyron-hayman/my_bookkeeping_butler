"use client";
import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import loadingStore from "@/stores/loadingStore";

type TransitionContextType = {
  globalLoading: boolean;
  navigate: (url: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  globalLoading: true,
  navigate: () => {},
});

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const globalLoading = loadingStore((state) => state.loadingState);
  const setGlobalLoading = loadingStore((state) => state.setLoading);

  const navigate = (url: string) => {
    setGlobalLoading();
    // delay before pushing route
    setTimeout(() => {
      router.push(url);
    }, 1000); // 800ms delay for animation
  };

  return (
    <TransitionContext.Provider value={{ globalLoading, navigate }}>
      {children}
      {/* Animated overlay */}
      <motion.div
        key="transition-overlay"
        initial={{ height: "100%" }}
        animate={{ height: globalLoading ? "100%" : "0%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      ></motion.div>
    </TransitionContext.Provider>
  );
}
