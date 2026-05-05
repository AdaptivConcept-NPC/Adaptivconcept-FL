import React from 'react';
import { getIconConfig } from '../config/iconRegistry';

/**
 * Standardized Brand Icon component that maps brands to their respective icon packages.
 * Uses a registry-first approach to ensure consistency and easy tracking of icon sources.
 * 
 * @param {string} name - The name of the brand (e.g., 'OpenAI', 'React', 'Python')
 * @param {number} size - Icon size in pixels
 * @param {string} className - Optional CSS classes
 */
const BrandIcon = ({ name, size = 24, className = '' }) => {
  const iconConfig = getIconConfig(name);

  if (!iconConfig) {
    console.warn(`BrandIcon: Icon "${name}" not found in any registered providers.`);
    return null;
  }

  const { component: Component, provider } = iconConfig;

  return (
    <div 
      className={`inline-flex items-center justify-center transition-all hover:scale-110 ${className}`} 
      style={{ width: size, height: size }}
      title={`${name} (${provider})`}
    >
       <Component size={size} />
    </div>
  );
};

export default BrandIcon;
