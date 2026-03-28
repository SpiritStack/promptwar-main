/**
 * OpenFDA Drug Label API client
 * Queries the drug labeling endpoint to cross-reference interaction data
 * from Gemini's analysis with FDA-approved drug labels.
 */

interface OpenFDADrugResult {
  drug_interactions?: string[];
  contraindications?: string[];
  warnings?: string[];
  openfda?: {
    brand_name?: string[];
    generic_name?: string[];
  };
}

interface OpenFDAResponse {
  results?: OpenFDADrugResult[];
}

export interface FDAInteractionData {
  drug: string;
  interactions_text: string | null;
  contraindications_text: string | null;
  warnings_text: string | null;
  found: boolean;
}

const OPENFDA_BASE_URL = "https://api.fda.gov/drug/label.json";

/**
 * Look up a drug by generic name in the OpenFDA database
 */
export async function lookupDrug(
  genericName: string
): Promise<FDAInteractionData> {
  try {
    const searchTerm = encodeURIComponent(genericName.toLowerCase());
    const url = `${OPENFDA_BASE_URL}?search=openfda.generic_name:"${searchTerm}"&limit=1`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        drug: genericName,
        interactions_text: null,
        contraindications_text: null,
        warnings_text: null,
        found: false,
      };
    }

    const data: OpenFDAResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return {
        drug: genericName,
        interactions_text: null,
        contraindications_text: null,
        warnings_text: null,
        found: false,
      };
    }

    const result = data.results[0];

    return {
      drug: genericName,
      interactions_text: result.drug_interactions?.join("\n") ?? null,
      contraindications_text: result.contraindications?.join("\n") ?? null,
      warnings_text: result.warnings?.join("\n") ?? null,
      found: true,
    };
  } catch {
    return {
      drug: genericName,
      interactions_text: null,
      contraindications_text: null,
      warnings_text: null,
      found: false,
    };
  }
}

/**
 * Look up multiple drugs and return all FDA data
 */
export async function lookupMultipleDrugs(
  genericNames: string[]
): Promise<FDAInteractionData[]> {
  const uniqueNames = [...new Set(genericNames.map((n) => n.toLowerCase()))];
  const results = await Promise.allSettled(uniqueNames.map(lookupDrug));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<FDAInteractionData> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}
