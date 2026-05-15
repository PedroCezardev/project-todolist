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

interface SidebarProps {
  mode: string;
}

const logo = '/WORDMAK PRINCIPAL.png';
const logoCollapsed = '/PC PRINCIPAL 1.png'

const SIDEBAR_WIDTH_EXPANDED = '16rem'; 
const SIDEBAR_WIDTH_COLLAPSED = '5rem'; 

const Sidebar: FC<SidebarProps> = ({ mode }) => {
  
    const [collapsed, setCollapsed] = useState(false);
    const [activeLink, setActiveLink] = useState<string>('');
    const router = useRouter();
  
    useEffect(() => {
        const targetWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED;
        document.documentElement.style.setProperty('--dynamic-sidebar-width', targetWidth);
    }, [collapsed]);
      
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.hash || window.location.pathname;
            setActiveLink(currentUrl);
        }
    }, []);
  
    const handleExpandClick = () => {
      setCollapsed(!collapsed);
      if (typeof window !== 'undefined') {
        document.body.classList.toggle(style.collapsed);
      }
    };
  
    const handleLinkClick = (href: string) => {
      setActiveLink(href);
    };

    // 4. Função de Logout
    const handleLogout = async (e: React.MouseEvent) => {
      e.preventDefault();
      
      const confirmou = confirm("Tem certeza que deseja sair?");
      if (!confirmou) return;

      try {
        await logOut();
        router.push('/Login');
      } catch (error) {
        console.error("Erro ao fazer logout", error);
      }
    };
  
    return (  
      <nav className={style.sidebar}>
        <div className={style.sidebarTopWrapper}>
          <div className={style.sidebarTop}>
            <Link href={'/'} passHref className={style.logoWrapper} title="Início">
              <Image src={collapsed ? logoCollapsed : logo} alt="Logo" className={style.logoSmall} width={800} height={800} />
            </Link>
          </div>
          <button className={style.expandBtn} onClick={handleExpandClick}>
            <MdArrowBackIosNew />
          </button>
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
    );
}

export default Sidebar;