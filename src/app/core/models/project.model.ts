export interface Project {
  id: number;
  name: string;
  description: string;
  marketId: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  startDate: Date;
  endDate?: Date;
  progress: number;  // 0-100
}