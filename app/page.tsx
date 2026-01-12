"use client"; // Necessário para usar useState no Next.js App Router

import React, { useState } from 'react';

// Definindo a interface diretamente aqui para evitar o erro de importação
interface Story {
  id: number;
  visual: string;
  legenda: string;
  fala: string;
}

const StoryCard = () => {
  const [copied, setCopied] = useState<string | null>(null);

  // Dados de exemplo para o App não abrir vazio
  const story: Story = {
    id: 1,
    visual: "Mostre os bastidores do seu dia a dia usando o app.",
    legenda: "Criando conteúdo com inteligência artificial! 🚀",
    fala: "Fala pessoal! Hoje vou mostrar como estou usando o Gemini para automatizar meus stories."
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl transition-all hover:border-blue-500/50 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Story {story.id}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-blue-400 text-xs font-semibold uppercase block mb-1">🎥 O que gravar (Visual)</label>
            <p className="text-slate-200 text-sm leading-relaxed">{story.visual}</p>
          </div>

          <div className="relative group">
            <label className="text-blue-400 text-xs font-semibold uppercase block mb-1">📝 O que escrever (Legenda)</label>
            <div className="flex items-start gap-2">
              <p className="text-slate-200 text-sm italic flex-grow">"{story.legenda}"</p>
              <button 
                onClick={() => copyToClipboard(story.legenda, 'legenda')}
                className="text-slate-400 hover:text-white transition-colors text-xs border border-slate-600 px-2 py-1 rounded"
              >
                {copied === 'legenda' ? "✅" : "📋 Copiar"}
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <label className="text-blue-400 text-xs font-semibold uppercase block mb-1">💬 O que falar (Script)</label>
            <div className="flex items-start gap-2">
              <p className="text-slate-300 text-sm leading-relaxed flex-grow">{story.fala}</p>
              <button 
                onClick={() => copyToClipboard(story.fala, 'fala')}
                className="text-slate-400 hover:text-white transition-colors text-xs border border-slate-600 px-2 py-1 rounded"
              >
                {copied === 'fala' ? "✅" : "📋 Copiar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
