
import React from 'react';
import { LogoIcon, MoreVerticalIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between p-4 text-white bg-slate-800/50 rounded-lg">
            <div className="flex items-center gap-3">
                <LogoIcon />
                <h1 className="text-xl font-semibold">Art-Scene - AI Storyboard Assistant</h1>
            </div>
            <button className="text-slate-400 hover:text-white">
                <MoreVerticalIcon />
            </button>
        </header>
    );
};

export default Header;
