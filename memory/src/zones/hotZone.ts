// PLACEHOLDER: memory/zones/hotZone.ts
// Scope 0.3.0 - Aktuelle Session (ungefilterter Zugriff)
//
// TODO: Implementiere Hot Zone Management:
//
// Die Hot Zone enthält alle Einträge der aktuellen Session.
// Ungefilterter Zugriff - alles ist verfügbar.
//
// Responsibilities:
// - Speichere neue Einträge (User + Assistant Messages)
// - Biete ungefilterten Zugriff auf aktuelle Session
// - Transition zu Mid Zone bei Session-Ende
// - Interface: load(sessionId, conversationId) → alle Einträge

export type HotZoneEntry = {
  readonly id: string;
  readonly sessionId: string;
  readonly conversationId: string;
  readonly role: "user" | "assistant" | "system";
  readonly content: string;
  readonly createdAt: string;
  readonly metadata?: Record<string, unknown>;
};

export type HotZone = {
  readonly load: (scope: { sessionId: string; conversationId: string }) => ReadonlyArray<HotZoneEntry>;
  readonly append: (entry: HotZoneEntry) => void;
  readonly onSessionEnd: (callback: () => void) => void;
};

// PLACEHOLDER: Implementation pending
export function createHotZone(): HotZone {
  // TODO: Implementiere Hot Zone mit SQLite-Backend
  return {
    load: () => [],
    append: () => {},
    onSessionEnd: () => {},
  };
}
