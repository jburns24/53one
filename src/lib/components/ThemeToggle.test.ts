import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle component', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Mock document.documentElement
  const documentElementMock = {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => false)
    }
  };

  beforeEach(() => {
    // Setup mocks before each test
    vi.stubGlobal('localStorage', localStorageMock);
    Object.defineProperty(document, 'documentElement', {
      value: documentElementMock,
      writable: true
    });
    
    // Mock onMount for Svelte 5
    vi.mock('svelte', () => {
      return {
        onMount: (fn: () => void) => fn()
      };
    });
    
    // Clear mocks between tests
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('should render in light mode by default', () => {
    render(ThemeToggle);
    
    // In light mode, we should have the moon icon for switching to dark mode
    expect(screen.getByLabelText('Switch to dark mode')).toBeTruthy();
  });

  it('should toggle theme when clicked', async () => {
    render(ThemeToggle);
    
    // Initially in light mode
    const themeToggle = screen.getByLabelText('Switch to dark mode');
    
    // Click to switch to dark mode
    await fireEvent.click(themeToggle);
    
    // Should add dark class and set localStorage
    expect(documentElementMock.classList.add).toHaveBeenCalledWith('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    
    // Button should now show option to switch to light mode
    expect(screen.getByLabelText('Switch to light mode')).toBeTruthy();
    
    // Click again to switch back to light mode
    await fireEvent.click(screen.getByLabelText('Switch to light mode'));
    
    // Should remove dark class and update localStorage
    expect(documentElementMock.classList.remove).toHaveBeenCalledWith('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });
});
