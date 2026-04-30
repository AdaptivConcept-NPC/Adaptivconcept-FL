import React from 'react';
import * as Icons from '@lobehub/icons';

/**
 * Standardized Brand Icon component using @lobehub/icons
 * @param {string} name - The name of the brand (e.g., 'OpenAI', 'React', 'Python')
 * @param {number} size - Icon size in pixels
 * @param {string} type - 'color', 'mono', or 'avatar' (defaults to 'color')
 */
const BrandIcon = ({ name, size = 24, type = 'color', className = '' }) => {
  // Normalize the name to match LobeHub exports
  const iconName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  
  // Handle common aliases or variations
  const nameMap = {
    'openai': 'OpenAI',
    'google': 'Google',
    'gemini': 'Gemini',
    'anthropic': 'Anthropic',
    'meta': 'Meta',
    'mistral': 'Mistral',
    'ollama': 'Ollama',
    'react': 'React',
    'nodejs': 'Nodejs',
    'python': 'Python',
    'javascript': 'Javascript',
    'typescript': 'Typescript',
    'postgresql': 'Postgresql',
    'mysql': 'Mysql',
    'firebase': 'Firebase',
    'threejs': 'Threejs',
    'vite': 'Vite',
    'tailwind': 'Tailwind',
    'github': 'Github',
    'vercel': 'Vercel',
    'langgraph': 'LangChain', // Fallback or closest match
    'groq': 'Groq',
  };

  const targetName = nameMap[name.toLowerCase()] || iconName;
  
  // Try to find the specific component variation
  const Component = Icons[targetName];

  if (!Component) {
    console.warn(`BrandIcon: Icon "${targetName}" not found in @lobehub/icons`);
    return null;
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
       <Component size={size} />
    </div>
  );
};

export default BrandIcon;
