import { CompagnyContact } from "./compagny-contact.model";
import { Picture } from "./picture.model";

export interface Compagny {
	id: string | number;
	name: string;
	website?: string;
	logoUrl?: string | null;
	createdAt: Date;
	updatedAt?: Date;
	color?: string;
	pictures?: Picture[];
	contacts?: CompagnyContact[]
}