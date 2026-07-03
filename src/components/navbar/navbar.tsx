"use client";

import Image from 'next/image';
import style from "./navbar.module.scss";
import { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { getCurrentUser } from "@/services/authService";

const Navbar = () => {

  const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') ?? 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          const name = user.get("name") || user.get("username") || "usuário";
          setUserName(name);
        }
      } catch (err) {
        console.error("Erro ao carregar usuário na navbar:", err);
      }
    };
    fetchUser();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className={style.navbar}>
      <div className={style.content}>
        <div className="flex md:hidden items-center mr-auto">
          <Image src="/LOGO-TAREFEX-BLUE.png" alt="Logo Tarefex" width={140} height={44} className="object-contain h-9 sm:h-10 w-auto" priority />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 ml-auto">
          <div className="hidden md:flex items-center">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all duration-200 shadow-sm border border-slate-200/80 hover:scale-105 active:scale-95"
              title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
            >
              {theme === 'light' ? (
                <MdLightMode className="h-5 w-5 text-amber-500 transition-transform hover:rotate-45 duration-300" />
              ) : (
                <MdDarkMode className="h-5 w-5 text-slate-700 transition-transform hover:-rotate-12 duration-300" />
              )}
            </button>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 font-medium text-sm sm:text-base">
              Olá, <span className="text-[#006EFF] font-bold">{userName || 'usuário'}</span>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;