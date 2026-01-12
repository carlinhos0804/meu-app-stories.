"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

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
      
      if (!apiKey || apiKey.length < 10) {
        throw new Error("API Key inválida ou não configurada no Vercel (NEXT_PUBLIC_GEMINI_KEY)");
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Ajuste para usar a versão estável do modelo
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
      });

      const generationConfig = {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1000,
      };

      const instrucao = `Crie um roteiro de story para Instagram sobre: ${prompt}. 
      Responda APENAS em formato JSON puro, sem textos extras, com as chaves: visual, legenda, fala.`;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: instrucao }] }],
        generationConfig,
      });

      const text = result.response.text();
      
      // Limpeza profunda do JSON para evitar erros de sintaxe
      const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const cleanJson = JSON.parse(jsonString);
      
      setStory(cleanJson);
    } catch (error: any) {
      console.error(error);
      // Mensagem detalhada para sabermos o que está errado
      alert("ERRO: " + (error.message.includes("403") ? "Chave sem permissão (Verifique o Google Cloud)" : error.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <h1 style={{ color: '#3b82f6', textAlign: 'center', fontSize: '22px', marginBottom: '20px' }}>📸 Story Studio AI</h1>
        
        <input 
          style={{ width: '100%', padding: '15px', borderRadius: '10px', marginBottom: '10px', color: '#000', border: 'none', fontSize: '16px', boxSizing: 'border-box' }}
          placeholder="Ex: Rotina de treino hoje"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={gerarStory}
          disabled={loading}
          style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: loading ? '#64748b' : '#2563eb', color: 'white', fontWeight: 'bold', border: 'none', marginBottom: '20px', cursor: 'pointer' }}
        >
          {loading ? "PROCESSANDO..." : "✨ GERAR COM GEMINI"}
        </button>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' }}>
          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', margin: '0 0 5px 0' }}>🎥 O QUE GRAVAR</p>
            <p style={{ fontSize: '14px', margin: 0 }}>{story.visual}</p>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', margin: '0 0 5px 0' }}>📝 LEGENDA</p>
            <p style={{ fontSize: '14px', margin: 0, fontStyle: 'italic' }}>"{story.legenda}"</p>
          </div>
          
          <div>
            <p style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', margin: '0 0 5px 0' }}>💬 SCRIPT DE FALA</p>
            <p style={{ fontSize: '14px', margin: 0 }}>{story.fala}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
