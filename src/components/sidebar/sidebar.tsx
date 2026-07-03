"use client";

import Link from 'next/link';
import style from './style.module.scss';
import Image from 'next/image';
import { useState, useEffect, FC } from 'react';
import { useRouter } from 'next/navigation';
import { MdArrowBackIosNew, MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { FaRegUserCircle } from 'react-icons/fa';
import { PiWarningOctagonBold } from "react-icons/pi";
import { AiOutlineSchedule } from "react-icons/ai";

import { logOut } from '@/services/authService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  mode: string;
}

const logo = '/LOGO-TAREFEX-WHITE.png';
const logoCollapsed = '/ICON-TAREFEX-PADRAO.png'

const SIDEBAR_WIDTH_EXPANDED = '16rem'; 
const SIDEBAR_WIDTH_COLLAPSED = '5rem'; 

const Sidebar: FC<SidebarProps> = ({ mode }) => {
  
    const [collapsed, setCollapsed] = useState(false);
    const [isBelow1024, setIsBelow1024] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [activeLink, setActiveLink] = useState<string>('');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const router = useRouter();
  
    useEffect(() => {
        const targetWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
        document.documentElement.style.setProperty('--dynamic-sidebar-width', targetWidth);
        if (typeof window !== 'undefined') {
          if (collapsed) {
            document.body.classList.add(style.collapsed);
          } else {
            document.body.classList.remove(style.collapsed);
          }
        }
    }, [collapsed]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          if (isHovered && collapsed) {
            document.body.classList.add(style.sidebarHovered);
          } else {
            document.body.classList.remove(style.sidebarHovered);
          }
        }
    }, [isHovered, collapsed]);
      
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.hash || window.location.pathname;
            setActiveLink(currentUrl);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                setCollapsed(true);
                setIsBelow1024(true);
            } else {
                setIsBelow1024(false);
            }
        };

        if (typeof window !== 'undefined') {
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);
  
    const handleExpandClick = () => {
      if (isBelow1024) return;
      setCollapsed(!collapsed);
    };
  
    const handleLinkClick = (href: string) => {
      setActiveLink(href);
    };

    // 4. Função de Logout
    const handleLogout = (e: React.MouseEvent) => {
      e.preventDefault();
      setShowLogoutDialog(true);
    };

    const confirmLogout = async () => {
      try {
        await logOut();
        router.push('/Login');
      } catch (error) {
        console.error("Erro ao fazer logout", error);
      }
    };
  
    return (  
      <>
        <nav 
        className={style.sidebar}
        onMouseEnter={() => collapsed && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={style.sidebarTopWrapper}>
          <div className={style.sidebarTop}>
            <Link href={'/'} passHref className={style.logoWrapper} title="Início">
              <Image src={(collapsed && !isHovered) ? logoCollapsed : logo} alt="Logo" className={style.logoSmall} width={800} height={800} />
            </Link>
          </div>
          {!isBelow1024 && (
            <button className={style.expandBtn} onClick={handleExpandClick}>
              <MdArrowBackIosNew />
            </button>
          )}
        </div>
        <hr className={style.hr} />
        <div className={style.sidebarLinks}>
          <h2>Principal</h2>
          <ul>
            <li>
              <Link
                href="/" title="Dashboard"
                className={`${style.tooltip} ${activeLink === '/dashboard' ? style.active : ''}`}
                onClick={() => handleLinkClick('/dashboard')}
              >
                <MdOutlineDashboard />
                <span className={`${style.link} ${style.hide}`}>Dashboard</span>
                <span className={style.tooltipContent}>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/Tarefas" title="Tarefas" 
                className={`${style.tooltip} ${activeLink === '/tarefas' ? style.active : ''}`}
                onClick={() => handleLinkClick('/tarefas')}
              >
                <AiOutlineSchedule />
                <span className={`${style.link} ${style.hide}`}>Tarefas</span>
                <span className={style.tooltipContent}>Tarefas</span>
              </Link>
            </li>
          </ul>  
            <div className={`${style.sidebarLinks} ${style.bottomLinks}`}>
              <h2>Mais Funcionalidades</h2>
              <ul>
                <li>
                  <Link 
                    href="/Perfil" title="Perfil" 
                    className={`${style.tooltip} ${activeLink === '/perfil' ? style.active : ''}`}
                    onClick={() => handleLinkClick('/perfil')}
                  >
                    <FaRegUserCircle />
                    <span className={`${style.link} ${style.hide}`}>Perfil</span>
                    <span className={style.tooltipContent}>Perfil</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/Reportar" title="Reportar" 
                    className={`${style.tooltip} ${activeLink === '/reportar' ? style.active : ''}`}
                    onClick={() => handleLinkClick('/reportar')}
                  >
                    <PiWarningOctagonBold />
                    <span className={`${style.link} ${style.hide}`}>Reportar</span>
                    <span className={style.tooltipContent}>Reportar</span>
                  </Link>
                </li>
              </ul>
              <ul>
                <li>
                  <Link 
                    href="/Login" 
                    title="Sair"
                    className={`${style.tooltip}`}
                    onClick={handleLogout}
                  >
                    <MdLogout className={style.logout} />
                    <span className={`${style.link} ${style.hide} ${style.logout}`}>Sair</span>
                    <span className={style.tooltipContent}>Sair</span>
                  </Link>
                </li>
              </ul>
            </div>
        </div>
      </nav>

      {/* Dialog de Confirmação de Logout */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-white max-w-sm p-0 gap-0 text-gray-800">
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
}

export default Sidebar;