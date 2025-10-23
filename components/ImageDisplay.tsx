
import React from 'react';
import { RefreshCwIcon } from './icons';
import { StoryboardImage } from '../types';

interface ImageDisplayProps {
    currentImage: StoryboardImage | null;
    isLoading: boolean;
    onRegenerate: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ currentImage, isLoading, onRegenerate }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/80 rounded-lg p-4 gap-4 relative">
            <div className="w-full h-full aspect-video bg-black rounded-md flex items-center justify-center overflow-hidden">
                {isLoading && (
                    <div className="flex flex-col items-center gap-4 text-white">
                        <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p>Generating your vision...</p>
                    </div>
                )}
                {!isLoading && currentImage && (
                    <>
                        <img src={currentImage.src} alt={currentImage.prompt} className="object-contain w-full h-full" />
                        <div className="absolute top-6 left-6 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                            Image {currentImage.id.split('-')[1]}
                        </div>
                    </>
                )}
                 {!isLoading && !currentImage && (
                    <div className="text-slate-500 text-center">
                        <p>Your generated scene will appear here.</p>
                        <p className="text-sm">Start by writing a prompt on the left.</p>
                    </div>
                )}
            </div>
             {currentImage && !isLoading && (
                <button 
                    onClick={onRegenerate}
                    className="bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-colors"
                >
                    <RefreshCwIcon className="w-4 h-4" />
                    Regenerate
                </button>
            )}
        </div>
    );
};

export default ImageDisplay;
