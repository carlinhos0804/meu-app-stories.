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
    if (!prompt) return alert("Por favor, digite um tema para o story!");
    setLoading(true);

    try {
      // Tenta ler a chave dos dois nomes possíveis
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_KEY || "";
      
      if (!apiKey) {
        alert("Erro: API Key não encontrada no Vercel!");
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const instrucao = `Crie um roteiro de story para Instagram sobre: ${prompt}. 
      Responda APENAS em formato JSON, sem comentários, com as chaves "visual", "legenda" e "fala".`;
      
      const result = await model.generateContent(instrucao);
      const response = await result.response;
      const text = response.text();
      
      // Limpa o texto caso a IA mande blocos de código ```json
      const cleanJson = JSON.parse(text.replace(/```json|```/g, ""));
      
      setStory(cleanJson);
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao gerar o conteúdo. Verifique sua chave no painel da Vercel.");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copiado!");
  };

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      color: 'white', 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ maxWidth: '450px', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#3b82f6', marginBottom: '5px' }}>📸 Story AI Studio</h1>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Crie conteúdos profissionais em segundos</p>
        </header>
        
        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            style={{ 
              width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #334155', 
              backgroundColor: '#1e293b', color: 'white', fontSize: '16px', outline: 'none'
            }}
            placeholder="Ex: Mostrando os bastidores do escritório..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button 
            onClick={gerarStory}
            disabled={loading}
            style={{ 
              width: '100%', padding: '15px', borderRadius: '12px', backgroundColor: '#2563eb', 
              color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer',
              opacity: loading ? 0.7 : 1, transition: '0.3s'
            }}
          >
            {loading ? "🤖 CRIANDO ROTEIRO..." : "✨ GERAR STORY"}
          </button>
        </div>

        <div style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '20px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <section style={{ marginBottom: '20px' }}>
            <label style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>🎥 O QUE GRAVAR</label>
            <p style={{ fontSize: '15px', marginTop: '5px', lineHeight: '1.5' }}>{story.visual}</p>
          </section>
          
          <section style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#0f172a', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ color: '#60a5fa', fontSize: '11px', fontWeight: 'bold
