export interface File {
  id: number;
  name: string;
  filename: string;
  originalFilename: string;
  alt?: string;
  contentType: string;
  originalSize: number;
  createdAt: string; 
  updatedAt?: string;
  deletedAt?: string;
  data?: string;
}