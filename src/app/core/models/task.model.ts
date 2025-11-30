export interface Task {
  id_tache?: number;
  titre: string;
  description?: string;
  id_marche: number;
  responsable?: number | Employee;
  date_debut: string;
  date_fin: string;
  duree_estimee?: number;
  priorite: string;  // Backend uses plain strings
  etat: string;      // Backend uses plain strings
  critique: boolean;
  pertinence?: string;
  created_at?: string;
  
  // For display
  marche?: {
    intitule?: string;
  };
  responsableDetails?: Employee;
}

export interface Employee {
  id_employe?: number;
  nom: string;
  prenom: string;
  id_service?: number;
  email?: string;
  telephone?: string;
  poste?: string;
}

// Keep enums for reference but backend uses strings
export enum TaskPriority {
  URGENT = 'Urgent',
  QUOTIDIEN = 'Quotidien',
  INFORMATIF = 'Informatif'
}

export enum TaskState {
  EN_ATTENTE = 'En attente',
  EN_COURS = 'En cours',
  VALIDEE = 'Validée',
  NON_VALIDEE = 'Non validée'
}

export enum TaskRelevance {
  PERTINENTE = 'Pertinente',
  NON_PERTINENTE = 'Non pertinente',
  A_REVOIR = 'À revoir'
}