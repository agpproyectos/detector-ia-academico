import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { ResultCard } from './components/ResultCard';
import { analyzeText, isApiConfigured } from './services/geminiService';
import type { DetailedAnalysisResult } from './types';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<DetailedAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsReady(isApiConfigured());
  }, []);

  const handleAnalysis = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Por favor, introduce texto para analizar.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeText(inputText);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al analizar el texto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText]);

  const handleClear = () => {
    setInputText('');
    setAnalysisResult(null);
    setError(null);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-red-300">
          <h1 className="text-2xl font-bold text-red-700 mb-4 text-center">Error de Configuración</h1>
          <p className="text-gray-700 text-center mb-6">
            La aplicación no pudo encontrar la clave de API de Google Gemini necesaria para funcionar.
          </p>
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="font-semibold text-gray-800 mb-2">Acción Requerida (para desarrolladores):</h2>
            <p className="text-sm text-gray-600">
              Esta aplicación necesita que la variable de entorno <code>API_KEY</code> esté disponible. Si estás desplegando en una plataforma como Netlify, por favor, configúrala en el panel de control de tu sitio:
            </p>
            <ol className="list-decimal list-inside mt-3 text-sm text-gray-600 space-y-1">
              <li>Ve a la configuración de tu sitio (Site configuration).</li>
              <li>Busca la sección de "Environment Variables" (Variables de Entorno).</li>
              <li>Añade una nueva variable con el nombre <code>API_KEY</code> y pega tu clave de API de Gemini como valor.</li>
              <li>Vuelve a desplegar (re-deploy) tu sitio para que los cambios surtan efecto.</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Analizador de Texto Académico</h2>
          <p className="text-center text-gray-600 mb-6">
            Pega el contenido académico a continuación para evaluar la probabilidad de que haya sido generado por una inteligencia artificial.
          </p>

          <div className="w-full">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe o pega tu texto aquí..."
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-y text-base"
              disabled={isLoading}
              aria-label="Área de texto para análisis"
            />
            <p className="text-right text-sm text-gray-500 mt-1 pr-1">
              {inputText.length} caracteres
            </p>
          </div>

          <div className="mt-6 flex justify-center items-center space-x-4">
            <button
              onClick={handleAnalysis}
              disabled={isLoading || !inputText.trim()}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span className="ml-2">Analizando...</span>
                </>
              ) : (
                'Analizar Contenido'
              )}
            </button>
            {(inputText || analysisResult || error) && !isLoading && (
                 <button
                    onClick={handleClear}
                    className="px-8 py-3 bg-transparent text-gray-600 font-semibold rounded-lg border border-gray-300 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all duration-300 ease-in-out"
                >
                    Limpiar
                </button>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {analysisResult && (
             <ResultCard result={analysisResult} />
          )}
        </div>
      </main>
       <footer className="text-center py-6 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Detector de Contenido Académico de IA. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;