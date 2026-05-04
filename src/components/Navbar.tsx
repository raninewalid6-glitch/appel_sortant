import { KeyRound, Menu, UserRoundCog } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Session from './Session';

interface NavbarProps { onMenuClick: () => void }

export default function Navbar({ onMenuClick }: NavbarProps) {
    return (
        <div className="bg-blanc p-4 shadow-blue flex justify-between">
            <button onClick={onMenuClick} className='text-blue' aria-label="Ouvrir/Fermer le menu">
                <Menu />
            </button>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className='text-blue mr-20 cursor-pointer'>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className='flex gap-2 items-center'><UserRoundCog /><Session /></div>
                                </PopoverTrigger>
                                <PopoverContent className='shadow-blue bg-blanc'>
                                    <form action="">
                                        <span className='p-max w-full hover:bg-blue hover:text-blanc duration-500 flex gap-4 items-center cursor-pointer'>
                                            <KeyRound className='w-[15px] h-[15px] ml-2' />Changer le mot de passe
                                        </span>
                                    </form>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent><p>Le Nom de l&apos;utilisateur</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
