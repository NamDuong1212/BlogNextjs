export interface CommentSectionState {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
  };
  post: {
    id: string;
  };
}
