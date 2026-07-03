"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineDashboard, MdLogout } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { PiWarningOctagonBold } from "react-icons/pi";
import { AiOutlineSchedule } from "react-icons/ai";
import { logOut } from "@/services/authService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MobileBottomNav = () => {
  const [activeLink, setActiveLink] = useState<string>("");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.pathname;
      setActiveLink(currentUrl);
    }
  }, []);

  const handleLinkClick = (href: string) => {
    setActiveLink(href);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutDialog(true);
  };

  const confirmLogout = async () => {
    try {
      await logOut();
      router.push("/Login");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  const navItems = [
    { href: "/Perfil", label: "Perfil", icon: FaRegUserCircle, key: "perfil" },
    { href: "/", label: "Início", icon: MdOutlineDashboard, key: "dashboard" },
    { href: "/Tarefas", label: "Tarefas", icon: AiOutlineSchedule, key: "tarefas" },
    { href: "/Reportar", label: "Reportar", icon: PiWarningOctagonBold, key: "reportar" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-white/95 dark:bg-[#032249]/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 h-16">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeLink === item.href || (item.href === "/" && activeLink === "/dashboard");
        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => handleLinkClick(item.href)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all duration-200 ${
              isActive ? "text-[#006EFF] font-bold scale-105" : "text-gray-500 dark:text-gray-400 hover:text-[#006EFF]"
            }`}
          >
            <div className={`p-1 rounded-xl transition-all duration-200 ${isActive ? "bg-[#006EFF]/10" : ""}`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={handleLogout}
        className="flex flex-col items-center justify-center flex-1 py-1 text-red-500 hover:text-red-600 transition-all duration-200"
      >
        <div className="p-1 rounded-xl">
          <MdLogout className="w-6 h-6" />
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight font-medium">Sair</span>
      </button>
      </nav>

      {/* Dialog de Confirmação de Logout Mobile */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-white max-w-[calc(100%-32px)] sm:max-w-sm p-0 gap-0 text-gray-800 z-50">
          <DialogHeader className="p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 shrink-0">
                <MdLogout className="h-5 w-5" />
              </div>
              <div className="text-left">
                <DialogTitle className="text-lg font-bold">Sair da plataforma</DialogTitle>
                <DialogDescription className="text-xs text-gray-500">Tem certeza que deseja encerrar sua sessão?</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-6 text-sm text-gray-600">
            Você precisará fazer login novamente com seu e-mail e senha para acessar suas missões e o progresso de XP.
          </div>
          <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl sm:rounded-b-2xl flex flex-row justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setShowLogoutDialog(false)} className="rounded-lg text-xs sm:text-sm">
              Cancelar
            </Button>
            <Button type="button" onClick={confirmLogout} className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm shadow-md">
              Sim, Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileBottomNav;
