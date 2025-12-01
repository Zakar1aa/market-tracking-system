export interface Approval {
  id_approbation?: number;
  id_marche: number;        // Changed from id_tache
  id_employe: number;
  statut: string;           // "Approuvé" or "Refusé"
  motif?: string;           // Changed from commentaire
  created_at?: string;
}

export interface ApprovalWithDetails extends Approval {
  employeNom?: string;
  employePrenom?: string;
  marcheIntitule?: string;
}