export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  birthday?: string;
  avatar?: string;
  isCreator: boolean;
  role: string;
  isActive: boolean;
  postsCount: number;
  walletBalance: number;
  likesCount?: number;
  reportsCount?: number;
}

export interface UpdateCreatorStatusDto {
  isCreator: boolean;
  reason?: string;
}