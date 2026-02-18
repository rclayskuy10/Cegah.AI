export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RiskReport {
  locationName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  hazards: string[];
  recommendations: string[];
}

export interface DamageAnalysis {
  severity: 'Minor' | 'Moderate' | 'Severe';
  damageType: string;
  immediateActions: string[];
  safetyCheck: string;
}

export interface DisasterStat {
  name: string;
  count: number;
  color: string;
}