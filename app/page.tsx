"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState({ 
    visual: "Aguardando...", legenda: "...", fala: "..." 
  });

  async function gerarStory() {
    if (!prompt) return alert("Digite um tema!");
    setLoading(true);

    try {
      // Usando o nome mais genérico possível para o Vercel aceitar
      const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";
      
      if (!apiKey) {
        alert("Erro: Adicione a variável NEXT_PUBLIC_API_KEY no Vercel e dê Redeploy!");
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const instrucao = `Gere um JSON para story de instagram sobre ${prompt}. Responda apenas o JSON com chaves: visual, legenda, fala.`;
      
      const result = await model.generateContent(instrucao);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      
      setStory(JSON.parse(text));
    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#3b82f6' }}>Story AI Studio</h2>
        
        <input 
          style={{ width: '100%', padding: '15px', borderRadius: '10px', marginBottom: '10px', color: '#000', border: 'none' }}
          placeholder="Tema do Story..."
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={gerarStory} 
          disabled={loading}
          style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', border: 'none', fontWeight: 'bold' }}
        >
          {loading ? "GERANDO..." : "CRIAR STORY AGORA"}
        </button>

        <div style={{ marginTop: '20px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px' }}>
          <p style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '12px' }}>🎥 VISUAL</p>
          <p style={{ fontSize: '14px' }}>{story.visual}</p>
          <hr style={{ borderColor: '#334155', margin: '15px 0' }} />
          <p style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '12px' }}>📝 LEGENDA</p>
          <p style={{ fontSize: '14px' }}>{story.legenda}</p>
          <hr style={{ borderColor: '#334155', margin: '15px 0' }} />
          <p style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '12px' }}>💬 FALA</p>
          <p style={{ fontSize: '14px' }}>{story.fala}</p>
        </div>
      </div>
    </div>
  );
}
