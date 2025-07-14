import { environment } from '#env/environment';
import { Technology } from '#SModels/technology.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {

  constructor(
		private readonly http: HttpClient
	) { }

	getAllTechnologies() {
		const url = `${environment.apiUrl}/technology/all`;
		return this.http.get<Technology[]>(url);
	}

	createTechnology(technology: Technology) {
		const url = `${environment.apiUrl}/technology/create`;
		return this.http.post<Technology>(url, technology);
	}

	updateTechnology(id: number, technology: Technology) {
		const url = `${environment.apiUrl}/technology/update/${id}`;
		return this.http.patch<Technology>(url, technology);
	}

	deleteTechnology(id: number) {
		const url = `${environment.apiUrl}/technology/delete/${id}`;
		return this.http.delete(url);
	}
}
