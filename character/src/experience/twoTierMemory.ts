// PLACEHOLDER: character/experience/twoTierMemory.ts
// Scope 0.3.0 - Schicht 1 (Fakten) + Schicht 2 (Patterns)
//
// TODO: Implementiere Two-Tier Memory System:
//
// TIER 1 - Personal (Concrete Facts):
// - Speichert: Konkrete Ereignisse, Zitate, Präferenzen
// - Schema: personal_facts (id, content, category, created_at, session_id)
// - Zugriff: Direkt über ID oder via Pattern-Links
//
// TIER 2 - Pattern (Abstract Anchors):
// - Speichert: Generalisierte Muster mit Konfidenz
// - Schema: patterns (id, anchor, type, confidence, examples_json, created_at)
// - Zugriff: Primärer Abfragemodus für Runtime
//
// LINKING:
// - pattern_links Tabelle verbindet Tier 1 und Tier 2
// - relation_type: 'supports', 'contradicts', 'example_of'

export type Tier = 1 | 2;

export type TwoTierMemoryConfig = {
  readonly tier1Table: "personal_facts";
  readonly tier2Table: "patterns";
  readonly linkTable: "pattern_links";
  readonly enableCrossTierQueries: boolean;
};

export const defaultTwoTierConfig: TwoTierMemoryConfig = {
  tier1Table: "personal_facts",
  tier2Table: "patterns",
  linkTable: "pattern_links",
  enableCrossTierQueries: true,
};

// PLACEHOLDER: Implementation pending
export function queryTier1(factId: string): null {
  // TODO: Query personal_facts table
  return null;
}

export function queryTier2(anchor: string): null {
  // TODO: Query patterns table
  return null;
}

export function linkTier1ToTier2(
  factId: string,
  patternId: string,
  relation: "supports" | "contradicts" | "example_of"
): void {
  // TODO: Insert into pattern_links table
}
