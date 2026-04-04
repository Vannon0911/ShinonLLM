// PLACEHOLDER: character/experience/patterns.ts
// Scope 0.3.0 - Pattern-Erkennung & Anker-Bildung
//
// TODO: Implementiere Pattern-Engine:
// - extractPattern(entry): Identifiziere Pattern-Typen aus Input
// - findContradictions(factA, factB): Erkenne Inkonsistenzen
// - scoreConfidence(pattern): Berechne Konfidenz (0.0-1.0)
//
// Pattern-Typen (MVP):
// - preference: "User mag X" / "User hasst Y"
// - commitment: "User will X tun bis Datum Y"
// - relationship: "User hat Beziehung zu X"
// - contradiction: "User sagte A, dann B" (Inkonsistenz)
//
// Beispiel-Szenario:
// 1.4.: "Ich bin glücklich mit Anna" → relationship pattern
// 5.3.: "Hab Date mit Lisa" → contradiction detected (Anna vs Lisa)

export type PatternType = "preference" | "commitment" | "relationship" | "contradiction";

export type Pattern = {
  readonly id: string;
  readonly anchor: string;           // z.B. "user-beziehung-inkonsistenz"
  readonly type: PatternType;
  readonly confidence: number;       // 0.0-1.0
  readonly examples: ReadonlyArray<{
    readonly factId: string;
    readonly content: string;
    readonly date: string;
  }>;
  readonly firstSeen: string;
  readonly lastReinforced: string;
  readonly reinforcementCount: number;
};

export type PersonalFact = {
  readonly id: string;
  readonly content: string;
  readonly category: "preference" | "event" | "commitment" | "relationship";
  readonly createdAt: string;
  readonly sessionId: string;
};

// PLACEHOLDER: Implementierung ausstehend
export function extractPattern(fact: PersonalFact): Pattern | null {
  // TODO: Implementiere Pattern-Extraktion basierend auf fact.category
  return null;
}

export function findContradictions(
  factA: PersonalFact,
  factB: PersonalFact
): boolean {
  // TODO: Implementiere Inkonsistenzerkennung
  // z.B. relationship mit verschiedenen Personen
  return false;
}

export function scoreConfidence(pattern: Pattern): number {
  // TODO: Berechne Konfidenz basierend auf:
  // - reinforcementCount (Häufigkeit)
  // - Zeit seit lastReinforced (Aktualität)
  // - Konsistenz der examples
  return pattern.confidence;
}
