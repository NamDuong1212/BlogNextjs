export interface ContentLayout {
  type: "text" | "image";
  content: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Post {
  tags: any;
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
  layout?: ContentLayout[];
}
