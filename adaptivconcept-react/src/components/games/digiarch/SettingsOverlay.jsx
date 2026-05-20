import React, { useState } from "react";
import { X, Key, Cpu, Eye, EyeOff, Save } from "lucide-react";
import { useArcade } from "../../../context/ArcadeContext";

const PROVIDERS = [
  { id: "gemini", name: "Gemini", defaultModel: "gemini-1.5-flash" },
  { id: "ollama_cloud", name: "Ollama", defaultModel: "llama3" },
  { id: "groq", name: "Groq", defaultModel: "llama-3.1-70b-versatile" },
  { id: "openrouter", name: "OpenRouter", defaultModel: "meta-llama/llama-3.1-8b-instruct:free" },
];

const MODELS_BY_PROVIDER = {
  gemini: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"],
  ollama_cloud: ["llama3", "llama-3.1-8b", "mistral", "phi3", "gemma2"],
  groq: ["llama-3.1-70b-versatile", "llama3-8b-8192", "mixtral-8x7b-32768", "gemma2-9b-it"],
  openrouter: [
    "meta-llama/llama-3.1-8b-instruct:free",
    "google/gemma-2-9b-it:free",
    "mistralai/mistral-7b-instruct:free",
    "gryphe/mythomax-l2-13b",
  ],
};

const SettingsOverlay = ({ isOpen, onClose }) => {
  const {
    provider,
    model,
    apiKeys,
    setProvider,
    setModel,
    updateApiKey,
  } = useArcade();

  const [selectedProvider, setSelectedProvider] = useState(provider);
  const [selectedModel, setSelectedModel] = useState(model);
  const [apiKey, setApiKey] = useState(apiKeys[provider] || "");
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleProviderChange = (pId) => {
    setSelectedProvider(pId);
    const providerDefaultModel = PROVIDERS.find((p) => p.id === pId)?.defaultModel || "";
    setSelectedModel(providerDefaultModel);
    setApiKey(apiKeys[pId] || "");
  };

  const handleSave = () => {
    setProvider(selectedProvider);
    setModel(selectedModel);
    updateApiKey(selectedProvider, apiKey);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="w-full max-w-md glass-theme rounded-2xl border border-white/10 p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-low hover:text-high transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <Cpu size={20} style={{ color: "var(--theme-color)" }} />
          <h2 className="text-lg font-bold font-comfortaa text-high">
            AI Engine Configuration
          </h2>
        </div>

        <div className="space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="text-xs font-mono text-low uppercase tracking-wider block mb-2">
              LLM Provider
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PROVIDERS.map((prov) => {
                const isSel = selectedProvider === prov.id;
                return (
                  <button
                    key={prov.id}
                    onClick={() => handleProviderChange(prov.id)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all border ${
                      isSel
                        ? "border-[#39ff14]/40 bg-[#39ff14]/10 text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.15)]"
                        : "border-white/10 bg-white/5 text-low hover:text-high hover:border-white/20"
                    }`}
                  >
                    {prov.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="text-xs font-mono text-low uppercase tracking-wider block mb-1">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-sm font-mono text-high focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/30 appearance-none"
            >
              {(MODELS_BY_PROVIDER[selectedProvider] || []).map((mName) => (
                <option key={mName} value={mName} className="bg-neutral-900 text-high font-mono">
                  {mName}
                </option>
              ))}
            </select>
          </div>

          {/* API Key */}
          <div>
            <label className="text-xs font-mono text-low uppercase tracking-wider block mb-1">
              BYOK API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3.5 text-low" size={14} />
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-9 pr-10 text-sm font-mono text-high focus:outline-none focus:border-[#39ff14] focus:ring-1 focus:ring-[#39ff14]/30"
                placeholder={`Paste your ${PROVIDERS.find((p) => p.id === selectedProvider)?.name} API key`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3 text-low hover:text-high transition-colors focus:outline-none"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-[10px] text-low font-mono mt-1.5 leading-normal uppercase">
              ⚠️ Keys are stored locally on your device. Never shared with third parties.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-adaptiv-orange text-white py-3.5 rounded-xl font-comfortaa font-bold hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-6"
          >
            <Save size={16} />
            <span>Apply Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsOverlay;
