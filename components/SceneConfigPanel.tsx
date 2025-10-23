
import React from 'react';
import { UploadIcon } from './icons';

interface SceneConfigPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    visualStyle: string;
    setVisualStyle: (style: string) => void;
    onGenerate: () => void;
    onImageUpload: (file: File) => void;
    isLoading: boolean;
    hasImages: boolean;
}

const aspectRatios = [ {label: "16:9", value: "16:9"}, {label: "1:1", value: "1:1"}, {label: "4:3", value: "4:3"}, {label: "9:16", value: "9:16"}];
const visualStyles = ["Cinematic", "Anime", "Fantasy", "Cyberpunk"];

const SceneConfigPanel: React.FC<SceneConfigPanelProps> = ({
    prompt, setPrompt, aspectRatio, setAspectRatio, visualStyle, setVisualStyle, onGenerate, onImageUpload, isLoading, hasImages
}) => {

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onImageUpload(event.target.files[0]);
            // Reset file input to allow uploading the same file again
            event.target.value = ''; 
        }
    };

    return (
        <div className="w-full md:w-96 bg-slate-800/50 p-6 rounded-lg flex flex-col gap-6 text-slate-300">
            <div>
                <h2 className="text-lg font-semibold text-white mb-2">Scene Configuration</h2>
                <p className="text-sm text-slate-400">Describe the first scene of your storyboard.</p>
            </div>

            <div>
                <label htmlFor="visual-style" className="block text-sm font-medium mb-2">Visual Style</label>
                <div className="grid grid-cols-2 gap-2">
                    {visualStyles.map(style => (
                        <button 
                            key={style}
                            onClick={() => setVisualStyle(style)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${visualStyle === style ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="aspect-ratio" className="block text-sm font-medium mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                     {aspectRatios.map(ratio => (
                        <button 
                            key={ratio.value}
                            onClick={() => setAspectRatio(ratio.value)}
                            className={`px-3 py-2 text-sm rounded-md transition-colors ${aspectRatio === ratio.value ? 'bg-cyan-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                        >
                            {ratio.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                 <label htmlFor="prompt" className="block text-sm font-medium mb-2">Prompt</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A detective in a rain-soaked office, looking out the window."
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                    disabled={isLoading}
                />
            </div>
            
            <div className="flex items-center gap-3 mt-auto">
                <button
                    onClick={onGenerate}
                    disabled={isLoading || !prompt}
                    className="flex-grow bg-cyan-500 text-white font-bold py-3 rounded-md hover:bg-cyan-600 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : null}
                    {isLoading ? 'Generating...' : hasImages ? 'Next Scene' : 'Generate Scene'}
                </button>
                <label
                    htmlFor="image-upload"
                    className={`p-3 rounded-md transition-colors ${isLoading ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600 cursor-pointer'}`}
                    aria-disabled={isLoading}
                    title="Upload Image"
                >
                    <UploadIcon className="w-6 h-6 text-slate-300" />
                </label>
                <input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept="image/png, image/jpeg" 
                    disabled={isLoading} 
                />
            </div>
        </div>
    );
};

export default SceneConfigPanel;
