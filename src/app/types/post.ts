export interface Post {
  id?: string;
  author: string;
  title: string;
  content: string;
  categoryId: string;
  createAt?: string;
  updatedAt?: string;
}

export interface CreatePostState {
  author: string;
  title: string;
  content: string;
  categoryId: string;
}

export interface UpdatePostState {
  id: string;
  content: string;
  categoryID: string;
}
