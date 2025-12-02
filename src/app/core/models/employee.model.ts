export interface Employee {
  id_employe?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string; // On le garde dans le modèle au cas où, mais on ne l'affiche pas
  poste?: string;     // Idem
  role: string;
  id_service?: number; // Pour l'envoi (création)
  
  // AJOUTER CECI pour l'affichage (lecture)
  service?: {
    id_service: number;
    nom: string;
  }; 
  
  actif?: boolean;
  created_at?: string;
}

export enum EmployeeRole {
  ADMIN = 'ADMIN',
  CHEF = 'CHEF',
  EMPLOYE = 'EMPLOYE'
}