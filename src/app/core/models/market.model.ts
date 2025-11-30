export interface Market {
  id_marche?: number;
  intitule: string;
  objectif: string;
  budget_estime?: number;
  date_debut: string;
  date_fin: string;
  statut: string;
  id_service: number;
  fichier_cps_path?: string;
  id_created_by?: number;
  created_at?: string;
}

export enum MarketStatus {
  EN_PREPARATION = 'EN_PREPARATION',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface Service {
  id_service?: number;
  nom: string;
  description?: string;
  actif?: boolean;
}

export interface Employee {
  id_employe?: number;
  nom: string;
  prenom: string;
  email: string;
  role: EmployeeRole;
  id_service: number;
  actif?: boolean;
}

export enum EmployeeRole {
  ADMIN = 'ADMIN',
  CHEF = 'CHEF',
  EMPLOYE = 'EMPLOYE'
}

export function getMarketStatusLabel(status: MarketStatus): string {
  const labels: Record<MarketStatus, string> = {
    [MarketStatus.EN_PREPARATION]: 'En préparation',
    [MarketStatus.EN_COURS]: 'En cours',
    [MarketStatus.TERMINE]: 'Terminé',
    [MarketStatus.ANNULE]: 'Annulé'
  };
  return labels[status];
}

export function getMarketStatusColor(status: MarketStatus): string {
  const colors: Record<MarketStatus, string> = {
    [MarketStatus.EN_PREPARATION]: 'accent',
    [MarketStatus.EN_COURS]: 'primary',
    [MarketStatus.TERMINE]: 'primary',
    [MarketStatus.ANNULE]: 'warn'
  };
  return colors[status];
}
