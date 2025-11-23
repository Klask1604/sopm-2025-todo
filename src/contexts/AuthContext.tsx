import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../config/supabase";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    async function initializeAuth() {
      try {
        console.log("🔐 Initializing auth...");

        // Timeout ABSOLUT: după 3 secunde, continuăm oricum
        timeoutId = setTimeout(() => {
          if (mounted && loading) {
            console.warn("⏰ Auth timeout - continuing anyway");
            setLoading(false);
          }
        }, 3000);

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Auth error:", error);
          if (mounted) setLoading(false);
          return;
        }

        if (!mounted) return;

        console.log(
          "✅ Session loaded:",
          session ? "authenticated" : "not authenticated"
        );
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Nu așteptăm - loadProfile e async în background
          loadProfile(session.user.id).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔄 Auth state changed:", _event);
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    });

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    console.log("👤 Loading profile for user:", userId);

    try {
      // Timeout scurt: 2 secunde maxim
      const profilePromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      const timeoutPromise = new Promise<any>((resolve) =>
        setTimeout(() => {
          console.warn("⏰ Profile timeout");
          resolve({ data: null, error: { message: "timeout" } });
        }, 2000)
      );

      const result = await Promise.race([profilePromise, timeoutPromise]);

      if (result.error && result.error.message !== "timeout") {
        console.error("⚠️ Profile error:", result.error);
      }

      if (result.data) {
        console.log("✅ Profile loaded:", result.data);
        setProfile(result.data);
        return;
      }

      // Dacă nu există profile, creăm unul cu fallback
      console.log("⚠️ No profile, creating fallback...");
      const { data: session } = await supabase.auth.getSession();
      const email = session?.session?.user?.email || userId;

      // Creăm profile fără await - fire and forget
      supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
          display_name: email.split("@")[0],
          avatar_url: null,
        })
        .select()
        .single()
        .then(({ data: newProfile }) => {
          if (newProfile) {
            console.log("✅ Profile created:", newProfile);
            setProfile(newProfile);
          }
        });

      // Setăm un profile temporar imediat
      setProfile({
        id: userId,
        email: email,
        display_name: email.split("@")[0],
        avatar_url: undefined,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("❌ Exception in loadProfile:", error);
    }

    console.log(" loadProfile finished");
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) throw error;
    await loadProfile(user.id);
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
