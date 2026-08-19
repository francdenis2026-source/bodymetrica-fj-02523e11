import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";
import { getUserTheme, updateUserTheme, setLocalTheme, getLocalTheme } from "@/lib/theme.functions";
import { supabase } from "@/integrations/supabase/client";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  setLocalTheme(theme);

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) metaThemeColor.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#f8fafc");
  window.dispatchEvent(new CustomEvent("bodymetrica-theme-change", { detail: theme }));
}

function resolveTheme(): Theme {
  return getLocalTheme() || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
}

async function persistThemeForAuthenticatedUser(theme: Theme) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from("profiles").update({ theme_preference: theme }).eq("id", session.user.id);
  } catch (error) {
    console.error("Erro ao sincronizar tema:", error);
  }
}

function installGlobalThemeControl() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const mount = () => {
    if (document.getElementById("bodymetrica-global-theme-toggle")) return;

    const path = window.location.pathname;
    const showGlobally = path === "/" || path.startsWith("/auth") || path.startsWith("/admin") || ["/terms", "/privacy", "/about", "/help", "/tools"].includes(path);
    if (!showGlobally) return;

    const style = document.createElement("style");
    style.id = "bodymetrica-global-theme-style";
    style.textContent = `
      #bodymetrica-global-theme-toggle{position:fixed;top:18px;right:18px;z-index:9999;height:40px;display:inline-flex;align-items:center;gap:8px;padding:0 13px;border-radius:999px;border:1px solid var(--border);background:color-mix(in oklch,var(--card) 88%,transparent);color:var(--foreground);box-shadow:0 10px 30px rgba(15,23,42,.12);backdrop-filter:blur(16px);font:600 12px/1 Inter,system-ui,sans-serif;cursor:pointer;transition:background .2s ease,border-color .2s ease,color .2s ease,transform .2s ease}
      #bodymetrica-global-theme-toggle:hover{background:var(--accent);transform:translateY(-1px)}
      #bodymetrica-global-theme-toggle:focus-visible{outline:2px solid var(--ring);outline-offset:2px}
      #bodymetrica-global-theme-toggle svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
      @media(max-width:640px){#bodymetrica-global-theme-toggle{top:12px;right:12px;width:40px;padding:0;justify-content:center}#bodymetrica-global-theme-toggle span{display:none}}
    `;
    if (!document.getElementById(style.id)) document.head.appendChild(style);

    const button = document.createElement("button");
    button.id = "bodymetrica-global-theme-toggle";
    button.type = "button";
    button.setAttribute("aria-label", "Alternar entre modo claro e escuro");
    button.setAttribute("title", "Alternar tema");

    const render = () => {
      const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
      button.innerHTML = theme === "dark"
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg><span>Modo claro</span>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"></path></svg><span>Modo escuro</span>';
    };

    button.addEventListener("click", async () => {
      const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      render();
      await persistThemeForAuthenticatedUser(next);
    });

    window.addEventListener("bodymetrica-theme-change", render);
    render();
    document.body.appendChild(button);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else queueMicrotask(mount);
}

installGlobalThemeControl();

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initTheme = async () => {
      const localTheme = resolveTheme();
      setTheme(localTheme);
      applyTheme(localTheme);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const { theme: serverTheme } = await getUserTheme();
          if (serverTheme && serverTheme !== localTheme) {
            setTheme(serverTheme);
            applyTheme(serverTheme);
          }
        } catch (error) {
          console.error("Erro ao carregar tema do servidor:", error);
        }
      }
    };

    initTheme();
    const handleExternalTheme = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      if (next === "light" || next === "dark") setTheme(next);
    };
    window.addEventListener("bodymetrica-theme-change", handleExternalTheme);
    return () => window.removeEventListener("bodymetrica-theme-change", handleExternalTheme);
  }, []);

  const toggleTheme = async () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    applyTheme(newTheme);
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      try { await updateUserTheme({ data: { theme: newTheme } }); }
      catch (error) { console.error("Erro ao salvar tema no servidor:", error); }
    }
  };

  if (!mounted) return <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full opacity-0" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-full border border-border/70 bg-background/70 shadow-sm backdrop-blur transition-colors hover:bg-accent"
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
    >
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
