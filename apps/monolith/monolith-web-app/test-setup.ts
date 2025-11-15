import { installGlobals } from '@remix-run/node';
import '@testing-library/jest-dom/matchers';
import { vi } from 'vitest';
import React from 'react';

installGlobals();

// Create mock component factory
const createMockComponent = () => {
  const MockComponent = () =>
    React.createElement(
      'div',
      { 'data-testid': 'mock-home-remote' },
      'Mock Home Remote'
    );
  return MockComponent;
};

// Mock Module Federation runtime
vi.mock('@module-federation/enhanced/runtime', () => ({
  init: vi.fn(),
  loadRemote: vi.fn((name: string) => {
    if (name === 'homeRemote/Module') {
      return Promise.resolve({
        default: createMockComponent(),
      });
    }
    return Promise.reject(new Error(`Unknown remote: ${name}`));
  }),
}));

// Mock remote modules
vi.mock('homeRemote/Module', () => ({
  default: createMockComponent(),
}));
