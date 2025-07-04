import { CompagnyContact } from "./compagny-contact.model";
import { Picture } from "./picture.model";

export interface Compagny {
	id: string | number;
	name: string;
	website?: string;
	logoUrl?: string | null;
	description?: string;
	contractStartAt?: Date;
	contractEndAt?: Date;
	type: 'CDI' | 'FREELANCE' | 'PROSPECT';
	createdAt: Date;
	updatedAt?: Date;
	color?: string;
	pictures?: Picture[];
	contacts?: CompagnyContact[]
}