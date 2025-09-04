import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user?: User | null;
  onSignOut?: () => void;
}

export default function GlobalNav({ user, onSignOut }: HeaderProps) {
  return (
    <div className="fixed flex items-center justify-center inset-x-0 bottom-5 z-[90]">
      <div className="flex items-center justify-center rounded-2xl backdrop-blur-md p-5 bg-black/10">
        <div>
          <form>
            <input
              type="text"
              placeholder="What movie are you looking for?"
              className="outline-[0px] w-[400px] py-2 px-4 text-md bg-black text-white rounded-full border-white/5 border-1 border-solid placeholder:text-stone-700"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
