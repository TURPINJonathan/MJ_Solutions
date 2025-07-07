export interface Technology {
	id: string | number;
	name: string;
	logoUrl?: string | null;
	type: 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'OTHER';
	proficiency: number;
	isFavorite?: boolean;
	createdAt: Date;
	updatedAt?: Date;
	color?: string;
	description?: string;
}