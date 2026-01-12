"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function StoryApp() {
  const result = await model.generateContent(instrucao);
const response = await result.response;
const text = response.text();

  async function gerarStory() {
    if (!prompt) return alert("Digite um tema!");
    setLoading(true);

    try {
      // Tenta pegar a chave de qualquer um dos nomes que você possa ter colocado
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_KEY || "";
      
      if (!apiKey) {
        alert("ERRO LOCAL: A chave não foi encontrada no Vercel. Verifique o nome da variável!");
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const instrucao = `Gere um JSON para story de instagram sobre ${prompt}. Use as chaves "visual", "legenda" e "fala".`;
      
      const result = await model.generateContent(instrucao);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      
      setStory(JSON.parse(text));
    } catch (error: any) {
      // ESTE ALERTA VAI TE DIZER O ERRO REAL
      alert("ERRO DA IA: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif' }}>
       <h2 style={{ textAlign: 'center' }}>📸 Gerador de Stories</h2>
       <input 
         style={{ width: '100%', padding: '12px', borderRadius: '8px', color: '#000', marginBottom: '10px' }}
         placeholder="Sobre o que vamos gravar?"
         onChange={(e) => setPrompt(e.target.value)}
       />
       <button 
         onClick={gerarStory} 
         disabled={loading}
         style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
       >
         {loading ? "GERANDO..." : "CRIAR AGORA"}
       </button>

       <div style={{ marginTop: '20px', background: '#1e293b', padding: '15px', borderRadius: '10px' }}>
          <p><b>Visual:</b> {story.visual}</p>
          <p><b>Legenda:</b> {story.legenda}</p>
          <p><b>Fala:</b> {story.fala}</p>
       </div>
    </div>
  );
}
