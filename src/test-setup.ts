import { expect, afterEach, vi, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from @testing-library/jest-dom
expect.extend(matchers);

// Mock Svelte for component testing
beforeAll(() => {
  // This mock provides the necessary functions for @testing-library/svelte
  vi.mock('svelte', () => {
    return {
      onMount: (fn: () => void) => fn(),
      mount: vi.fn(),
      createRoot: vi.fn(),
      tick: vi.fn(),
      detach: vi.fn()
    };
  });
});

// Run cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  vi.resetModules();
});
