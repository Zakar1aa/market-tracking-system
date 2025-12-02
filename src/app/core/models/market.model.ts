import { Service } from './service.model';
import { Employee } from './employee.model';

export interface Market {
  id_marche?: number;
  intitule: string;
  objectif: string;
  budget_estime?: number;
  date_debut: string; // Le backend renvoie 'date_debut'
  date_fin: string;   // Le backend renvoie 'date_fin'
  statut: MarketStatus;
  
  // Lecture : Le backend renvoie des objets complets
  service?: Service; 
  created_by?: Employee;

  // Écriture (optionnel, pour l'aide au typage si besoin)
  id_service?: number;
  id_created_by?: number;
  
  fichier_cps_path?: string;
  created_at?: string;
}

export enum MarketStatus {
  EN_PREPARATION = 'EN_PREPARATION',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}