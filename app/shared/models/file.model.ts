export interface File {
	id: number;
	createdAt: Date;
	filename: string;
	data: string;
	name: string;
	alt: string;
	originalSize: number;
	contentType: string;
	originalFilename: string;
}