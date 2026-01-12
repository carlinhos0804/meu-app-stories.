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
      // Tenta buscar a chave em todos os nomes que testamos
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      
      if (!apiKey) {
        alert("ERRO: Configure a variável NEXT_PUBLIC_GEMINI_KEY no painel da Vercel e faça um Redeploy.");
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Usando o modelo gemini-1.5-flash (garanta que o package.json esteja em ^0.21.0)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const instrucao = `Crie um roteiro de story para Instagram sobre o tema: ${prompt}. 
      Responda ESTRITAMENTE em formato JSON puro, sem textos extras ou blocos de código, usando exatamente estas chaves:
      {"visual": "descrição da cena", "legenda": "texto curto para a tela", "fala": "script para falar no vídeo"}`;
      
      const result = await model.generateContent(instrucao);
      const response = await result.response;
      let text = response.text();
      
      // Limpeza de segurança: remove marcações de markdown ```json se a IA enviar
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const cleanJson = JSON.parse(text);
      setStory(cleanJson);

    } catch (error: any) {
      console.error("Erro detalhado:", error);
      if (error.message.includes("404")) {
        alert("Erro 404: O Google não encontrou o modelo. Verifique se o seu package.json está com a versão ^0.21.0 da biblioteca.");
      } else {
        alert("Erro na IA: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const copiarTexto = (texto: string) => {
    navigator.clipboard.writeText(texto);
    alert("Copiado com sucesso!");
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#3b82f6', fontSize: '26px', marginBottom: '5px' }}>✨ Story Creator AI</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Crie roteiros profissionais pelo celular</p>
        </header>
        
        <div style={{ marginBottom: '20px' }}>
          <input 
            style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', fontSize: '16px', marginBottom: '10px', boxSizing: 'border-box' }}
            placeholder="Ex: Rotina de trabalho em casa..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={gerarStory}
            disabled={loading}
            style={{ width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: loading ? '#475569' : '#2563eb', color: 'white', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.3s' }}
          >
            {loading ? "CRIANDO ROTEIRO..." : "GERAR STORY"}
          </button>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>🎥 O QUE GRAVAR</label>
            <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{story.visual}</p>
          </div>
          
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <label style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold' }}>📝 LEGENDA (TELA)</label>
              <span onClick={() => copiarTexto(story.legenda)} style={{ fontSize: '10px', color: '#94a3b8', cursor: 'pointer' }}>Copiar</span>
            </div>
            <p
