export interface Picture {
	id: number;
	fileId?: number;
	field?: number;
	fileName: string;
	url: string;
	logo?: boolean;
	master?: boolean;
}