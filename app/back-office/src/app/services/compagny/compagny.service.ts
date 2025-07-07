import { environment } from "#env/environment";
import { Compagny } from '#SModels/compagny.model';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class CompagnyService {
	constructor(
		private readonly http: HttpClient
	) {}

	getAllCompagnies() {
		const url = `${environment.apiUrl}/compagny/all`;
		return this.http.get<Compagny[]>(url);
	}

	createCompagny(data: any) {
		return this.http.post(`${environment.apiUrl}/compagny/create`, data);
	}
	
	updateCompagny(id: number, data: any) {
			return this.http.patch(`${environment.apiUrl}/compagny/update/${id}`, data);
	}

	deleteCompagny(id: number) {
		return this.http.delete(`${environment.apiUrl}/compagny/delete/${id}`);
	}
}