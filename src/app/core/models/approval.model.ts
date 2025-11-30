export interface Approval {
  id_approbation?: number;
  id_tache: number;
  id_employe: number;
  statut: ApprovalStatus;
  commentaire?: string;
  date_approbation?: string;
  created_at?: string;
}

export enum ApprovalStatus {
  EN_ATTENTE = 'En attente',
  APPROUVE = 'Approuvé',
  REJETE = 'Rejeté'
}

export interface ApprovalWithEmployee extends Approval {
  employeNom?: string;
  employePrenom?: string;
}