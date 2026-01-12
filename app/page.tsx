"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function StoryApp() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState({ 
    visual: "Aguardando seu tema...", 
    legenda: "A legenda aparecerá aqui", 
    fala: "O script de fala aparecerá aqui" 
  });

 async function gerarStory() {
    if (!prompt) return alert("Por favor, digite um tema!");
    setLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || "";
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Forçando uma versão estável e simplificada
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });

      const instrucao = `Crie um roteiro de story para Instagram sobre: ${prompt}. Responda apenas com o JSON: {"visual": "...", "legenda": "...", "fala": "..."}`;
      
      const result = await model.generateContent(instrucao);
      const text = result.response.text();
      
      // Tenta limpar possíveis marcações de markdown da IA
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const cleanJson = JSON.parse(jsonString);
      
      setStory(cleanJson);
    } catch (error: any) {
      console.error("Erro detalhado:", error);
      // Isso vai nos mostrar o erro real no seu celular
      alert("Erro do Google: " + (error.message || "Falha na conexão"));
    } finally {
      setLoading(false);
    }
  }
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1 style={{ color: '#3b82f6', textAlign: 'center', fontSize: '22px' }}>📸 Story Studio AI</h1>
        
        <input 
          style={{ width: '100%', padding: '15px', borderRadius: '10px', marginBottom: '10px', color: '#000', border: 'none', fontSize: '16px' }}
          placeholder="Ex: Minha rotina matinal"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={gerarStory}
          disabled={loading}
          style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', border: 'none', marginBottom: '20px', cursor: 'pointer' }}
        >
          {loading ? "GERANDO ROTEIRO..." : "GERAR COM GEMINI"}
        </button>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' }}>
          <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold' }}>🎥 O QUE GRAVAR</p>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>{story.visual}</p>
          
          <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold' }}>📝 LEGENDA</p>
          <p style={{ fontSize: '14px', marginBottom: '15px', fontStyle: 'italic' }}>"{story.legenda}"</p>
          
          <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold' }}>💬 SCRIPT DE FALA</p>
          <p style={{ fontSize: '14px' }}>{story.fala}</p>
        </div>
      </div>
    </div>
  );
}
