import { Picture } from "./picture.model";

export interface CompagnyContact {
	lastname: string;
	firstname: string;
	position: string;
	email: string;
	phone: string;
	picture: Picture | File | null;
}