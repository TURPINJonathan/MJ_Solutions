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
}
