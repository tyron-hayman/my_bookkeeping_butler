'use client'
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/supabaseClient";
import { toast } from "sonner";
import { User } from '@supabase/supabase-js';
import Header from "@/components/HeaderComponent";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        router.replace('/login');
        return;
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.replace('/login');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.replace('/login');
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[url(/images/grad_bg.jpg)] flex items-center justify-center">
        <div className="text-amber-500 text-xl font-mono">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="w-full p-5 md:p-0 bg-[url(/images/grad_bg.jpg)] min-h-screen">
        <Header user={user} onSignOut={handleSignOut} />
    </main>
  );
}
