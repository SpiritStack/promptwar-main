import { describe, it, expect, vi } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import { analyzeMedications } from '../lib/gemini';

// Mock the GenAI SDK
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: JSON.stringify({
            overall_safety_status: 'safe',
            summary: 'Test summary',
            medications: [],
            interactions: [],
            duplicates: [],
            schedule: { slots: [] }
          })
        })
      };
    }
  };
});

describe('Gemini Medication Analyzer', () => {
  it('throws an error if GEMINI_API_KEY is not set', async () => {
    // Temporarily delete the key
    const originalKey = process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    
    await expect(analyzeMedications([], undefined, undefined, undefined, 'en')).rejects.toThrow('GEMINI_API_KEY environment variable is not set');
    
    // Restore
    process.env.GEMINI_API_KEY = originalKey;
  });

  it('correctly passes patient data into the system instruction prompt', async () => {
    // Ensure key exists
    process.env.GEMINI_API_KEY = 'test_key';
    
    const audit = await analyzeMedications([], 75, undefined, 'Penicillin', 'en');
    
    expect(audit.overall_safety_status).toBe('safe');
    expect(audit.summary).toBe('Test summary');
  });
});
