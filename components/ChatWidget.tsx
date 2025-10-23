
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { streamChatResponse } from '../services/geminiService';
import { MessageCircleIcon, XIcon, SendIcon } from './icons';

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const newMessages: ChatMessage[] = [...messages, userMessage];
        const modelMessage: ChatMessage = { role: 'model', text: '' };
        setMessages(prev => [...prev, modelMessage]);

        try {
            const stream = streamChatResponse(newMessages.slice(0, -1), input);
            let fullResponse = '';
            for await (const chunk of stream) {
                fullResponse += chunk;
                 setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    if (lastMsg && lastMsg.role === 'model') {
                        const updatedMsg = { ...lastMsg, text: fullResponse };
                        return [...prev.slice(0, -1), updatedMsg];
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg && lastMsg.role === 'model') {
                     const errorMsg = { ...lastMsg, text: "Sorry, I couldn't get a response." };
                     return [...prev.slice(0, -1), errorMsg];
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-cyan-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center hover:bg-cyan-600 transition-transform transform hover:scale-110"
            >
                <MessageCircleIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-slate-800 rounded-lg shadow-2xl flex flex-col text-white animate-fade-in-up">
                    <header className="flex items-center justify-between p-4 border-b border-slate-700">
                        <h3 className="font-semibold">AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </header>
                    <main className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-slate-700'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && messages[messages.length-1]?.role === 'model' && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-700 px-4 py-2 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </main>
                    <footer className="p-4 border-t border-slate-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Ask anything..."
                                className="flex-1 bg-slate-700 border border-slate-600 rounded-full py-2 px-4 outline-none focus:ring-2 focus:ring-cyan-500"
                                disabled={isLoading}
                            />
                            <button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-cyan-500 p-2 rounded-full hover:bg-cyan-600 disabled:bg-slate-600">
                                <SendIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </footer>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
