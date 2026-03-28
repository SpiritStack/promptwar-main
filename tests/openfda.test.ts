import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lookupDrug, lookupMultipleDrugs } from '../lib/openfda';

// Mock the global fetch object
global.fetch = vi.fn();

describe('OpenFDA API Client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('successfully retrieves drug interaction context', async () => {
    const mockResponse = {
      results: [
        {
          drug_interactions: ['May cause dizziness with alcohol.'],
          contraindications: ['Not for use in pregnant women.'],
          warnings: ['High risk of drowsiness.']
        }
      ]
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await lookupDrug('Tylenol');

    expect(result.found).toBe(true);
    expect(result.drug).toBe('Tylenol');
    expect(result.interactions_text).toContain('dizziness');
    expect(result.contraindications_text).toContain('pregnant');
    expect(result.warnings_text).toContain('drowsiness');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles 404/not found gracefully without crashing', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
    });

    const result = await lookupDrug('FakeDrug123');

    expect(result.found).toBe(false);
    expect(result.interactions_text).toBeNull();
  });

  it('deduplicates multiple drug queries and resolves them', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ drug_interactions: ['Test'] }] }),
    });

    const results = await lookupMultipleDrugs(['Ibuprofen', 'Ibuprofen', 'Aspirin']);
    
    // Should only call fetch 2 times because 'Ibuprofen' is duplicated
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(results.length).toBe(2);
  });
});
