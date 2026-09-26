import React, { useState } from 'react';
import { Bot, Sparkles, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Task, RouteOptimizationResult } from '../types';
import { apiRequest } from '../services/api';

interface AIAssistantProps {
  tasks: Task[];
  optimizationResult: RouteOptimizationResult;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ tasks, optimizationResult }) => {
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adviceSource, setAdviceSource] = useState<string | null>(null);

  const fetchAdvice = async (customQuery?: string) => {
    const activeQuery = customQuery || query || "How should I prioritize today's route?";
    setError(null);
    setIsLoading(true);

    try {
      const activeTasks = tasks.filter((t) => !t.completed);

      const payload = {
        tasks: activeTasks.map((t) => ({
          name: t.name,
          address: t.address,
          priority: t.priority,
          deadline: t.deadline,
          notes: t.notes,
          completed: t.completed,
        })),
        optimizedOrder: optimizationResult.stops.map((s) => `${s.stopOrder}. ${s.task.name}`),
        totalDistanceKm: optimizationResult.totalDistanceKm,
        estimatedTravelTimeMin: optimizationResult.estimatedTravelTimeMin,
        userQuery: activeQuery,
      };

      const response = await apiRequest<{ advice: string; source: string }>('/api/ai/route-advice', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setAdvice(response.advice);
      setAdviceSource(response.source);
    } catch (err: any) {
      setError(err.message || 'Failed to generate AI advice. Please ensure you are logged in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setQuery(promptText);
    fetchAdvice(promptText);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-sky-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-sky-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              AI Route Assistant
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Intelligent field worker schedule & priority recommendations
            </p>
          </div>
        </div>

        {adviceSource && (
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {adviceSource === 'openai' ? 'OpenAI Powered' : 'AI Dispatch Engine'}
          </span>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 scrollbar-none">
        <button
          onClick={() => handleQuickPrompt("How should I prioritize today's route?")}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white shrink-0 transition"
        >
          🎯 Prioritize Stops
        </button>
        <button
          onClick={() => handleQuickPrompt("Analyze deadline risks and time conflicts.")}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white shrink-0 transition"
        >
          ⏰ Deadline Check
        </button>
        <button
          onClick={() => handleQuickPrompt("Give me route efficiency & travel tips.")}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-xs font-medium text-slate-300 hover:text-white shrink-0 transition"
        >
          💡 Field Efficiency Tips
        </button>
      </div>

      {/* Output Advice Container */}
      <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 min-h-[160px] overflow-y-auto mb-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            <span className="text-xs font-medium">Analyzing tasks, distance, and priorities...</span>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2.5 text-red-400 text-xs p-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        ) : advice ? (
          <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed space-y-2 whitespace-pre-wrap">
            {advice}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-6 text-center text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs font-medium text-slate-400">
              Generate route advice after creating your route stops.
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Click a quick prompt above or ask a custom question below.
            </p>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchAdvice();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask AI Route Assistant..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md transition disabled:opacity-50"
          title="Send query"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};
