import { User } from "@supabase/supabase-js";
import { Clapperboard } from "lucide-react";

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="w-full fixed inset-x-0 top-0 p-6 z-[90]">
      <div className="w-full flex items-center justify-center">
        <h1 className="text-white text-md font-black capitalize">
          <Clapperboard className="inline-block mr-4" />{" "}
          <span>My Film Bookmark</span>
        </h1>
      </div>
    </header>
  );
}
