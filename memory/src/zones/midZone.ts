// PLACEHOLDER: memory/zones/midZone.ts
// Scope 0.3.0 - Letzte 10 Sessions (selektiver Zugriff)
//
// TODO: Implementiere Mid Zone Management:
//
// Die Mid Zone enthält die letzten 10 Sessions.
// Selektiver Zugriff - nur Top 20% nach Relevanz.
//
// Responsibilities:
// - Halte letzte 10 Sessions vorrätig
// - Score-basierte Selektion (top 20%)
// - Transition zu Cold Zone nach 10 Sessions
// - Query: SELECT ... ORDER BY score DESC LIMIT 20%

export type MidZoneEntry = {
  readonly id: string;
  readonly sessionId: string;
  readonly conversationId: string;
  readonly score: number;
  readonly content: string;
  readonly createdAt: string;
};

export type MidZone = {
  readonly load: (scope: { userId: string; maxResults?: number }) => ReadonlyArray<MidZoneEntry>;
  readonly promoteFromHot: (entries: ReadonlyArray<MidZoneEntry>) => void;
  readonly demoteToCold: (sessionIds: ReadonlyArray<string>) => void;
};

// PLACEHOLDER: Implementation pending
export function createMidZone(): MidZone {
  // TODO: Implementiere Mid Zone mit Score-basierter Selektion
  return {
    load: () => [],
    promoteFromHot: () => {},
    demoteToCold: () => {},
  };
}
