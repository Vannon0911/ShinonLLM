// PLACEHOLDER: character/attitudes/tracker.ts
// Scope 0.3.0 - Dynamische Haltungen pro User
//
// TODO: Implementiere Attitude-Tracking für jeden User:
// - Warmth (-10 kalt bis +10 warm)
// - Respect (-10 verachtend bis +10 wertschätzend)
// - Patience (-10 genervt bis +10 nachsichtig)
// - Trust (-10 misstrauisch bis +10 vertrauend)
//
// Updates basieren auf erkannten Patterns:
// - Inkonsistenz gefunden → Patience -2, Respect -1
// - Versprechen eingehalten → Trust +3
// - Wiederholtes Verhalten → entsprechende Dimensionen
//
// Thresholds für Confrontation-Modus:
// - Wenn Patience < 5 UND confidence > 0.8 → Konfrontation

export type AttitudeDimension = "warmth" | "respect" | "patience" | "trust";

export type AttitudeState = {
  readonly warmth: number;   // -10 (kalt) to +10 (warm)
  readonly respect: number;  // -10 (verachtend) to +10 (wertschätzend)
  readonly patience: number; // -10 (genervt) to +10 (nachsichtig)
  readonly trust: number;    // -10 (misstrauisch) to +10 (vertrauend)
  readonly history: ReadonlyArray<{
    readonly timestamp: string;
    readonly dimension: AttitudeDimension;
    readonly change: number;
    readonly reason: string;
  }>;
};

export function createAttitudeState(): AttitudeState {
  return {
    warmth: 0,
    respect: 0,
    patience: 5,  // Start neutral-positive
    trust: 0,
    history: [],
  };
}

export function updateAttitude(
  state: AttitudeState,
  dimension: AttitudeDimension,
  change: number,
  reason: string
): AttitudeState {
  const current = state[dimension];
  const next = Math.max(-10, Math.min(10, current + change));
  
  return {
    ...state,
    [dimension]: next,
    history: [
      ...state.history,
      {
        timestamp: new Date().toISOString(),
        dimension,
        change,
        reason,
      },
    ],
  };
}

export function shouldConfront(state: AttitudeState, patternConfidence: number): boolean {
  return state.patience < 5 && patternConfidence > 0.8;
}
