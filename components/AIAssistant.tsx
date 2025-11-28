import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './Icons';

// Inicializa o cliente Gemini usando a chave API definida em vite.config.ts
// O tipo GoogleGenAI é importado do módulo '@google/genai' que é resolvido via importmap.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AIAssistant: React.FC = () => {
  const [processDescription, setProcessDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!processDescription.trim()) {
      setError('Por favor, insira uma descrição do processo para análise.');
      return;
    }
    
    if (!process.env.GEMINI_API_KEY) {
        setError('A chave GEMINI_API_KEY não está configurada. Verifique o arquivo .env.local.');
        return;
    }

    setIsLoading(true);
    setError('');
    setAnalysisResult('');

    const prompt = `Você é um assistente de auditoria interna. Analise o seguinte processo e forneça um resumo estruturado em Markdown, incluindo:
1. Resumo Executivo do Processo.
2. Pontos Fortes (Controles Positivos).
3. Pontos Fracos (Áreas de Risco/Melhoria).
4. Sugestões de Achados de Auditoria (com códigos fictícios, se necessário).

Processo para Análise:
---
${processDescription}
---
`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setAnalysisResult(response.text);
    } catch (err) {
      console.error('Erro ao chamar a API Gemini:', err);
      setError('Ocorreu um erro ao analisar o processo. Verifique se a chave API está correta e se o serviço está disponível.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderização simples de Markdown para listas e cabeçalhos
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => {
      if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-azul-escuro">{line.substring(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-6 mb-3 text-azul-escuro">{line.substring(3)}</h2>;
      if (line.startsWith('* ')) return <li key={index} className="list-disc ml-6 text-gray-700">{line.substring(2)}</li>;
      if (line.startsWith('1. ')) return <li key={index} className="list-decimal ml-6 text-gray-700">{line.substring(3)}</li>;
      if (line.startsWith('- ')) return <li key={index} className="list-disc ml-6 text-gray-700">{line.substring(2)}</li>;
      if (line.startsWith('---')) return <hr key={index} className="my-4 border-gray-300" />;
      return <p key={index} className="mb-1 text-gray-700">{line}</p>;
    });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center space-x-2">
        <SparklesIcon className="w-8 h-8 text-azul-escuro" />
        <h1 className="text-2xl md:text-3xl font-bold text-azul-escuro">Assistente de Análise de Processos (IA)</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Descreva o Processo para Análise</h2>
        <textarea
          className="form-textarea w-full p-3 border border-gray-300 rounded-md focus:ring-azul-claro focus:border-azul-claro"
          rows={8}
          placeholder="Ex: O processo de compras inicia com a solicitação do setor, que é aprovada pelo gerente. Em seguida, o setor de compras realiza três cotações e escolhe a de menor preço. O pagamento é autorizado pelo diretor financeiro, que também realiza a conciliação bancária..."
          value={processDescription}
          onChange={(e) => setProcessDescription(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !processDescription.trim()}
          className="flex items-center gap-2 bg-azul-claro text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-azul-escuro transition duration-300 disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analisando...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Analisar Processo
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-vermelho-status/10 border border-vermelho-status text-vermelho-status p-4 rounded-lg">
          <p className="font-semibold">Erro na Análise:</p>
          <p>{error}</p>
        </div>
      )}

      {analysisResult && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-azul-escuro mb-4 border-b pb-2">Resultado da Análise de IA</h2>
          <div className="prose max-w-none">
            {renderMarkdown(analysisResult)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;