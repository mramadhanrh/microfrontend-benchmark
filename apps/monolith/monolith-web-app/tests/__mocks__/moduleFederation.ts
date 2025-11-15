import { vi } from 'vitest';
import React from 'react';

// Mock Module Federation runtime
export const init = vi.fn((config: any) => {
  console.log('Mock init called with config:', config);
  return Promise.resolve();
});

export const loadRemote = vi.fn((name: string) => {
  console.log('Mock loadRemote called for:', name);

  // Return mock components based on remote name
  if (name === 'homeRemote/Module' || name.includes('homeRemote')) {
    return Promise.resolve({
      default: () => {
        return React.createElement(
          'div',
          { 'data-testid': 'mock-home-remote' },
          React.createElement('h1', null, 'Mock Home Remote')
        );
      },
    });
  }

  return Promise.reject(new Error(`Unknown remote: ${name}`));
});

export const loadShare = vi.fn();
export const registerRemotes = vi.fn();
