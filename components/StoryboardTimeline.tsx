
import React from 'react';
import { StoryboardImage } from '../types';
import { TrashIcon, DownloadIcon } from './icons';

interface StoryboardTimelineProps {
    images: StoryboardImage[];
    onDelete: (id: string) => void;
    onSelect: (id: string) => void;
    selectedImageId: string | null;
}

const StoryboardTimeline: React.FC<StoryboardTimelineProps> = ({ images, onDelete, onSelect, selectedImageId }) => {
    const handleDownload = (image: StoryboardImage, index: number) => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `storyboard_scene_${String(index + 1).padStart(2, '0')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportSequence = () => {
        images.forEach((image, index) => {
            // A small delay between downloads can help prevent browser blocking
            setTimeout(() => {
                handleDownload(image, index);
            }, index * 200);
        });
    };
    
    return (
        <div className="w-full bg-slate-800/50 p-4 rounded-lg flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">Storyboard</h3>
            {images.length === 0 ? (
                 <div className="flex items-center justify-center h-24 bg-slate-800 rounded-md">
                    <p className="text-slate-500">Your storyboard is empty.</p>
                </div>
            ) : (
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <div key={image.id} className="flex-shrink-0 w-40 group relative">
                            <div className={`aspect-video bg-black rounded-md overflow-hidden border-2 ${selectedImageId === image.id ? 'border-cyan-500' : 'border-transparent'}`}>
                                <img 
                                    src={image.src} 
                                    alt={`Storyboard frame ${index + 1}`} 
                                    className="w-full h-full object-cover cursor-pointer"
                                    onClick={() => onSelect(image.id)}
                                />
                            </div>
                            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => onDelete(image.id)} className="p-1.5 bg-red-600/80 text-white rounded-full hover:bg-red-500" title="Delete Image">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDownload(image, index)} className="p-1.5 bg-cyan-600/80 text-white rounded-full hover:bg-cyan-500" title="Download Image">
                                    <DownloadIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="flex-shrink-0 w-40 h-[90px] flex items-center justify-center bg-slate-800 border-2 border-dashed border-slate-600 rounded-md">
                        <span className="text-slate-500">+</span>
                    </div>
                </div>
            )}
            {images.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleExportSequence}
                        className="bg-cyan-500 text-white font-bold py-2 px-5 rounded-md hover:bg-cyan-600 transition-colors flex items-center gap-2"
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Export Sequence
                    </button>
                </div>
            )}
        </div>
    );
};

export default StoryboardTimeline;
