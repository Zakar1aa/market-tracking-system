export interface Comment {
  id_commentaire?: number;
  id_tache: number;
  id_auteur: number;
  contenu: string;
  priorite: CommentType;
  created_at?: string;
  
  // Optional: populated if backend includes author details
  auteur?: {
    id_employe?: number;
    nom?: string;
    prenom?: string;
  };
}

export enum CommentType {
  URGENT = 'URGENT',
  QUOTIDIEN = 'QUOTIDIEN',
  INFORMATIF = 'INFORMATIF'
}