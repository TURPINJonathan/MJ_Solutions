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
}