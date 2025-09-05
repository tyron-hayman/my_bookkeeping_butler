"use client";
import { User } from "@supabase/supabase-js";
import { Clapperboard } from "lucide-react";
import { useTransition } from "@/contexts/PageTransition";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  const [scrollDirection, setScrollDirection] = useState<number>(0);
  const { navigate } = useTransition();
  const links: Array<{ id: number; title: string; link: string }> = [
    { id: 1, title: "home", link: "/" },
    { id: 2, title: "login", link: "/login" },
  ];
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (current) => {
    setScrollDirection(current);
  });

  return (
    <header
      className={`w-full fixed inset-x-0 top-0 px-10 py-5 z-[90] transition-all duration-500 ${
        scrollDirection > 400 ? "backdrop-blur-sm" : null
      }`}
    >
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-white text-md font-black capitalize">
            <Clapperboard className="inline-block mr-4" />{" "}
            <span>My Film Bookmark</span>
          </h1>
        </div>
        <div>
          <ul className="m-0 p-0 flex items-center gap-4">
            {links.map(
              (
                link: { id: number; title: string; link: string },
                index: number
              ) => {
                return (
                  <li key={link.id}>
                    <a
                      className="cursor-pointer text-white font-black uppercase text-md"
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        navigate(`${link.link}`);
                        return false;
                      }}
                    >
                      {link.title}
                    </a>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
