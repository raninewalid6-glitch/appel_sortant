"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { Power } from "lucide-react";
import { LogOutButton } from "@/actions/route";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";

interface SubMenuItem { title: string; link: string }
interface MenuItem { title: string; icon: ReactNode; link?: string; Submenu?: SubMenuItem[] }
interface SideBarProps {
  menu: MenuItem[];
  titre: string;
  isOpen: boolean;
  onLinkClick?: () => void;
}

export default function Sidebar({ menu, titre, isOpen, onLinkClick }: SideBarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const toggleSubMenu = (title: string) => setOpen(open === title ? null : title);
  const isSubMenuActive = (submenu: SubMenuItem[]) => submenu.some((subItem) => pathname === subItem.link);

  return (
    <aside className={`fixed inset-y-0 left-0 z-40 bg-blue flex flex-col justify-between overflow-hidden transition-all duration-300 md:static md:translate-x-0 ${isOpen ? "w-64 translate-x-0 md:w-64" : "w-0 -translate-x-full md:w-20"}`}>
      <ScrollArea className="w-full h-full">
        <h1 className="flex items-center text-white p-4 text-sm sm:text-base md:text-lg gap-2">
          <Image src="/logo.png" alt="logo" width={30} height={30} />
          {isOpen && <span>{titre}</span>}
        </h1>
        <ul className="p-3 sm:p-4">
          {menu.map((item, index) => (
            <li key={index} className="mt-2">
              {item.Submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className={`flex items-center gap-x-2 cursor-pointer p-2.5 rounded-md w-full transition-colors duration-300 ${(open === item.title || isSubMenuActive(item.Submenu)) ? "bg-white text-blue" : "text-white"} group hover:bg-white`} onClick={() => toggleSubMenu(item.title)}>
                      <span className={`mr-2 duration-500 group-hover:text-blue ${isSubMenuActive(item.Submenu) ? "text-blue" : "text-white"}`}>{item.icon}</span>
                      {isOpen && <span className="text-sm group-hover:text-blue">{item.title}</span>}
                    </div>
                  </DropdownMenuTrigger>
                  {open === item.title && item.Submenu && isOpen && (
                    <DropdownMenuContent className="w-full">
                      {item.Submenu.map((subItem, subIndex) => (
                        <DropdownMenuItem asChild key={subIndex}>
                          <Link onClick={onLinkClick} href={subItem.link} className={`text-sm block w-full cursor-pointer p-2.5 transition-colors duration-300 break-words ${pathname === subItem.link ? "text-blue" : "text-gray-800"} hover:text-blue`}>{subItem.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              ) : item.link && (
                <Link onClick={onLinkClick} href={item.link} className={`flex items-center gap-x-2 cursor-pointer p-2.5 rounded-md w-full transition-colors duration-300 ${pathname === item.link ? "bg-white text-blue" : "text-white"} group hover:bg-white`}>
                  <span className={`mr-2 duration-500 ${pathname === item.link ? "text-blue" : "text-white"} group-hover:text-blue`}>{item.icon}</span>
                  {isOpen && <span className="text-sm group-hover:text-blue break-words">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
      <form className="w-full p-4" action={LogOutButton}>
        <button type="submit" className="w-full group hover:bg-white p-2 text-white flex rounded-lg transition-colors duration-500 items-center">
          <Power className="mr-2 group-hover:text-blue" />
          {isOpen && <span className="group-hover:text-blue">Déconnexion</span>}
        </button>
      </form>
    </aside>
  );
}
