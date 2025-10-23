
import React from 'react';
import { Suggestion } from '../types';
import { CameraIcon, FilmIcon, FocusIcon } from './icons';

interface SuggestionPanelProps {
    suggestions: Suggestion[] | null;
    isLoading: boolean;
    onGenerate: (prompt: string) => void;
    imageCount: number;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
    "Camera Shot": <CameraIcon className="w-5 h-5 mr-3 text-cyan-400" />,
    "Action/Movement": <FilmIcon className="w-5 h-5 mr-3 text-cyan-400" />,
    "Detail Focus": <FocusIcon className="w-5 h-5 mr-3 text-cyan-400" />,
};

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({ suggestions, isLoading, onGenerate, imageCount }) => {
    const [selectedPrompt, setSelectedPrompt] = React.useState<string>('');

    React.useEffect(() => {
        if (suggestions && suggestions.length > 0) {
            setSelectedPrompt(suggestions[0].prompt);
        } else {
            setSelectedPrompt('');
        }
    }, [suggestions]);
    
    const handleGenerateClick = () => {
        if (selectedPrompt) {
            onGenerate(selectedPrompt);
        }
    };
    
    return (
        <div className="w-full md:w-96 bg-slate-800/50 p-6 rounded-lg flex flex-col gap-6 text-slate-300">
            <div>
                <h2 className="text-lg font-semibold text-white mb-1">AI Suggestions for Image {imageCount + 1}</h2>
                <p className="text-sm text-slate-400">Choose the next shot for your sequence.</p>
            </div>
            
            <div className="flex flex-col gap-3">
                {isLoading && (
                     <div className="flex flex-col items-center justify-center h-48">
                        <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-slate-400">Thinking of next scenes...</p>
                    </div>
                )}
                {!isLoading && suggestions && suggestions.map((suggestion) => (
                     <button
                        key={suggestion.prompt}
                        onClick={() => setSelectedPrompt(suggestion.prompt)}
                        className={`p-4 rounded-lg text-left transition-all duration-200 border-2 ${selectedPrompt === suggestion.prompt ? 'bg-slate-700/50 border-cyan-500' : 'bg-slate-700/20 border-transparent hover:border-slate-600'}`}
                    >
                        <div className="flex items-center mb-2">
                             {categoryIcons[suggestion.category] || <div className="w-5 h-5 mr-3" />}
                             <h4 className="font-semibold text-white">{suggestion.category}</h4>
                        </div>
                        <p className="text-sm text-slate-400 ml-8">{suggestion.prompt}</p>
                    </button>
                ))}
                 {!isLoading && !suggestions && (
                    <div className="flex items-center justify-center h-48 bg-slate-800 rounded-md">
                        <p className="text-slate-500 text-center">Suggestions will appear here after the first image is generated.</p>
                    </div>
                )}
            </div>

            <button
                onClick={handleGenerateClick}
                disabled={!selectedPrompt || isLoading}
                className="w-full bg-cyan-500 text-white font-bold py-3 rounded-md hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed mt-auto"
            >
                Generate Image {imageCount + 1}
            </button>
        </div>
    );
};

export default SuggestionPanel;
