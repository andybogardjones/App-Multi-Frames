
import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import SceneConfigPanel from './components/SceneConfigPanel';
import ImageDisplay from './components/ImageDisplay';
import StoryboardTimeline from './components/StoryboardTimeline';
import SuggestionPanel from './components/SuggestionPanel';
import ChatWidget from './components/ChatWidget';
import { StoryboardImage, Suggestion } from './types';
import { generateImage, fetchSuggestions } from './services/geminiService';

const App: React.FC = () => {
    const [storyboardImages, setStoryboardImages] = useState<StoryboardImage[]>([]);
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const [visualStyle, setVisualStyle] = useState<string>('Cinematic');
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const selectedImage = useMemo(() => {
        if (!selectedImageId) return storyboardImages[storyboardImages.length - 1] || null;
        return storyboardImages.find(img => img.id === selectedImageId) || null;
    }, [selectedImageId, storyboardImages]);

    const handleGenerate = useCallback(async (promptOverride?: string) => {
        const promptToUse = promptOverride || currentPrompt;
        if (!promptToUse) {
            setError("Prompt cannot be empty.");
            return;
        }

        setError(null);
        setIsGeneratingImage(true);
        setSuggestions(null); // Clear old suggestions

        try {
            const fullPrompt = `${promptToUse}, ${visualStyle} style, high detail, cinematic lighting`;
            const imageSrc = await generateImage(fullPrompt, aspectRatio);
            
            const newImage: StoryboardImage = {
                id: `img-${storyboardImages.length + 1}-${Date.now()}`,
                src: imageSrc,
                prompt: promptToUse,
            };

            setStoryboardImages(prev => [...prev, newImage]);
            setSelectedImageId(newImage.id);

            // Fetch suggestions for the new image
            setIsFetchingSuggestions(true);
            try {
                const newSuggestions = await fetchSuggestions(promptToUse);
                setSuggestions(newSuggestions);
            } catch (suggestionError) {
                setError("Failed to fetch suggestions, but image was generated.");
            } finally {
                setIsFetchingSuggestions(false);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsGeneratingImage(false);
        }
    }, [currentPrompt, visualStyle, aspectRatio, storyboardImages.length]);

    const handleRegenerate = useCallback(() => {
        if (selectedImage) {
            // This is a simplified regenerate. A more complex one might remove the old image.
            handleGenerate(selectedImage.prompt);
        }
    }, [selectedImage, handleGenerate]);

    const handleDeleteImage = (id: string) => {
        setStoryboardImages(prev => {
            const newImages = prev.filter(img => img.id !== id);
             if (selectedImageId === id) {
                // If the deleted image was selected, select the last image or null if empty
                setSelectedImageId(newImages.length > 0 ? newImages[newImages.length - 1].id : null);
            }
            return newImages;
        });
    };

    const handleImageUpload = useCallback((file: File) => {
        if (!file || isGeneratingImage) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageSrc = e.target?.result as string;
            if (imageSrc) {
                const newImage: StoryboardImage = {
                    id: `img-${storyboardImages.length + 1}-${Date.now()}`,
                    src: imageSrc,
                    prompt: `Uploaded: ${file.name}`,
                };
                setStoryboardImages(prev => [...prev, newImage]);
                setSelectedImageId(newImage.id);
            }
        };
        reader.onerror = () => {
            setError("Failed to read the uploaded image.");
        };
        reader.readAsDataURL(file);
    }, [isGeneratingImage, storyboardImages.length]);
    
    return (
        <div className="min-h-screen text-white p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
            <Header />
            {error && (
                <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <main className="flex-1 flex flex-col lg:flex-row gap-6">
                <SceneConfigPanel
                    prompt={currentPrompt}
                    setPrompt={setCurrentPrompt}
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    visualStyle={visualStyle}
                    setVisualStyle={setVisualStyle}
                    onGenerate={() => handleGenerate()}
                    onImageUpload={handleImageUpload}
                    isLoading={isGeneratingImage}
                    hasImages={storyboardImages.length > 0}
                />
                <div className="flex-1 flex flex-col gap-6 min-w-0">
                    <ImageDisplay 
                        currentImage={selectedImage}
                        isLoading={isGeneratingImage}
                        onRegenerate={handleRegenerate}
                    />
                    <StoryboardTimeline 
                        images={storyboardImages}
                        onDelete={handleDeleteImage}
                        onSelect={setSelectedImageId}
                        selectedImageId={selectedImageId}
                    />
                </div>
                <SuggestionPanel 
                    suggestions={suggestions}
                    isLoading={isFetchingSuggestions}
                    onGenerate={handleGenerate}
                    imageCount={storyboardImages.length}
                />
            </main>
            <ChatWidget />
        </div>
    );
};

export default App;
