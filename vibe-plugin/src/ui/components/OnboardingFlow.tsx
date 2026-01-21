import { useState } from 'react';

interface OnboardingFlowProps {
    onSaveKey: (key: string) => void;
}

export function OnboardingFlow({ onSaveKey }: OnboardingFlowProps) {
    const [key, setKey] = useState('');
    const [showVideo, setShowVideo] = useState(false);

    const handleSave = () => {
        if (key.trim().length > 10) {
            onSaveKey(key.trim());
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-slate-200 font-sans p-8 overflow-y-auto">
            <div className="max-w-md mx-auto w-full mt-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    Welcome to VIBE.OS
                </h1>
                <p className="text-slate-400 mb-8 text-lg font-light">
                    Your AI-Powered Design System Architect
                </p>

                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                Activation Key Required
                            </label>
                            <input
                                type="password"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                                placeholder="Paste Gemini API Key here..."
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={key.length < 10}
                            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                        >
                            INITIALIZE SYSTEM
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-slate-900 px-2 text-xs text-slate-500">First time?</span>
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="block text-indigo-400 hover:text-indigo-300 text-sm underline decoration-indigo-500/30 underline-offset-4"
                            >
                                Get your free Gemini API Key →
                            </a>

                            <button
                                onClick={() => setShowVideo(!showVideo)}
                                className="text-slate-500 hover:text-slate-400 text-xs flex items-center justify-center gap-1 mx-auto"
                            >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Watch 30s Tutorial
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video Embed Placeholder */}
                {showVideo && (
                    <div className="mt-6 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                        <div className="aspect-video bg-black flex items-center justify-center text-slate-600">
                            [Video Player Placeholder]
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
