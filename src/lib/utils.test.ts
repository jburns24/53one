import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should combine class names correctly', () => {
    // Test basic class combination
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500');
    
    // Test conditional classes
    expect(cn('text-base', true && 'font-bold', false && 'italic')).toBe('text-base font-bold');
    
    // Test with array of classes
    expect(cn('flex', ['items-center', 'justify-between'])).toBe('flex items-center justify-between');
    
    // Test with object syntax
    expect(cn('p-4', { 'rounded-md': true, 'shadow-sm': false })).toBe('p-4 rounded-md');
    
    // Test Tailwind class merging
    expect(cn('p-2 p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
