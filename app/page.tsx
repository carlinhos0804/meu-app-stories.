"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ShareStream() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function gerarConteudo() {
    if (!prompt) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const promptFinal = `Crie um roteiro de story para Instagram sobre: ${prompt}. Responda apenas um JSON com: visual, legenda, fala.`;
      const res = await model.generateContent(promptFinal);
      const text = res.response.text().replace(/```json|```/g, "").trim();
      setResult(JSON.parse(text));
    } catch (e) {
      alert("Conectando com a base...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-1px', marginBottom: '20px', color: '#3b82f6' }}>SHARE STREAM</h1>
        
        <input 
          style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', fontSize: '16px', marginBottom: '10px', outline: 'none' }}
          placeholder="O que vamos criar hoje?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={gerarConteudo}
          disabled={loading}
          style={{ width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#fff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? "PROCESSANDO..." : "GERAR STORY"}
        </button>

        {result && (
          <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', fontSize: '12px', fontWeight: 'bold' }}>SCENE</span>
              <p style={{ fontSize: '16px', marginTop: '5px' }}>{result.visual}</p>
            </div>
            <div style={{ marginBottom: '20px', backgroundColor: '#111', padding: '15px', borderRadius: '10px' }}>
              <span style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'bold' }}>OVERLAY TEXT</span>
              <p style={{ fontSize: '16px', marginTop: '5px', fontStyle: 'italic' }}>"{result.legenda}"</p>
            </div>
            <div style={{ backgroundColor: '#111', padding: '15px', borderRadius: '10px' }}>
              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>SCRIPT</span>
              <p style={{ fontSize: '16px', marginTop: '5px' }}>{result.fala}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
