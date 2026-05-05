import * as LobeIcons from '@lobehub/icons';
import { 
  SiJavascript, 
  SiVite, 
  SiReact, 
  SiPython, 
  SiLangchain,
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiFirebase,
  SiVercel,
  SiGithub,
  SiNodedotjs,
  SiTypescript,
  SiFastapi,
  SiDjango,
  SiStackblitz,
  SiReplit,
  SiZapier
} from 'react-icons/si';
import { TbApi, TbApiApp } from 'react-icons/tb';

// Mapping of icon names to their respective components and sources
// This ensures we have a clear source of truth for every icon used in the app
export const ICON_REGISTRY = {
  // LobeHub Icons (Preferred for AI brands)
  'OpenAI': { component: LobeIcons.OpenAI, provider: 'lobe' },
  'Gemini': { component: LobeIcons.Gemini, provider: 'lobe' },
  'Anthropic': { component: LobeIcons.Anthropic, provider: 'lobe' },
  'Meta': { component: LobeIcons.Meta, provider: 'lobe' },
  'Mistral': { component: LobeIcons.Mistral, provider: 'lobe' },
  'Ollama': { component: LobeIcons.Ollama, provider: 'lobe' },
  'Groq': { component: LobeIcons.Groq, provider: 'lobe' },
  'OpenRouter': { component: LobeIcons.OpenRouter, provider: 'lobe' },
  'LangGraph': { component: LobeIcons.LangGraph, provider: 'lobe' },
  'LangChain': { component: LobeIcons.LangChain, provider: 'lobe' },
  
  // React Icons / SimpleIcons (Reliable for tech stack)
  'Javascript': { component: SiJavascript, provider: 'react-icons' },
  'Vite': { component: SiVite, provider: 'react-icons' },
  'React': { component: SiReact, provider: 'react-icons' },
  'Python': { component: SiPython, provider: 'react-icons' },
  'Nodejs': { component: SiNodedotjs, provider: 'react-icons' },
  'Typescript': { component: SiTypescript, provider: 'react-icons' },
  'Fastapi': { component: SiFastapi, provider: 'react-icons' },
  'Django': { component: SiDjango, provider: 'react-icons' },
  'Stackblitz': { component: SiStackblitz, provider: 'react-icons' },
  'Replit': { component: SiReplit, provider: 'react-icons' },
  'Tailwind': { component: SiTailwindcss, provider: 'react-icons' },
  'Postgresql': { component: SiPostgresql, provider: 'react-icons' },
  'Mysql': { component: SiMysql, provider: 'react-icons' },
  'Firebase': { component: SiFirebase, provider: 'react-icons' },
  'Vercel': { component: SiVercel, provider: 'react-icons' },
  'Github': { component: SiGithub, provider: 'react-icons' },
  'Zapier': { component: SiZapier, provider: 'react-icons' },
  'Api': { component: TbApi, provider: 'react-icons' },
  'ApiApp': { component: TbApiApp, provider: 'react-icons' },
};

/**
 * Helper to get an icon by name with a fallback mechanism
 * @param {string} name 
 * @returns {object|null} { component, provider }
 */
export const getIconConfig = (name) => {
  const normalized = name.toLowerCase();
  
  // 1. Check registry first (explicit mapping)
  const entry = Object.keys(ICON_REGISTRY).find(k => k.toLowerCase() === normalized);
  if (entry) return ICON_REGISTRY[entry];
  
  // 2. Fallback to LobeHub by matching exact export name if possible
  const pascalName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  if (LobeIcons[pascalName]) {
    return { component: LobeIcons[pascalName], provider: 'lobe' };
  }
  
  return null;
};
