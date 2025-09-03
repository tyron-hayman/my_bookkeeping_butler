import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export default function Header({ user, onSignOut }: HeaderProps) {
  return (
    <header className="w-full fixed inset-x-0 top-0 p-6 bg-black z-[90]">
      <div className="w-full flex items-center justify-center">
        <h1 className="text-white text-lg font-black uppercase">
          MYB Plus -{" "}
          <span className="font-normal capitalize text-stone-500">
            Favourite & Get Suggestions
          </span>
        </h1>
      </div>
    </header>
  );
}
