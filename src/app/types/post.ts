export interface Post {
  user: any;
  id?: string;
  author: string;
  title: string;
  content: string;
  category: any;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  viewCount?: number;
}
