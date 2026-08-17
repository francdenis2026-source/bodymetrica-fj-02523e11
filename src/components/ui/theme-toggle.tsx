import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { getUserTheme, updateUserTheme, setLocalTheme, getLocalTheme } from "@/lib/theme.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const initTheme = async () => {
      // 1. Try local storage first for instant response
      const localTheme = getLocalTheme();
      if (localTheme) {
        setTheme(localTheme);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }

      // 2. If logged in, sync from server
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const { theme: serverTheme } = await getUserTheme();
          if (serverTheme && serverTheme !== localTheme) {
            setTheme(serverTheme);
            setLocalTheme(serverTheme);
          }
        } catch (error) {
          console.error("Erro ao carregar tema do servidor:", error);
        }
      }
    };

    initTheme();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    setLocalTheme(theme);
    
    // Update theme-color meta tag for PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#ffffff");
    }
  }, [theme, mounted]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      try {
        await updateUserTheme({ theme: newTheme });
      } catch (error) {
        console.error("Erro ao salvar tema no servidor:", error);
      }
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 opacity-0" />
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 hover:bg-primary/10 transition-colors"
      aria-label="Alternar tema"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-foreground" />
      )}
    </Button>
  );
}
