import { environment } from "#env/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})
export class FileService {
	constructor(
		private readonly http: HttpClient
	) {}

	uploadLogo(formData: FormData) {
  return this.http.post(`${environment.apiUrl}/files/upload`, formData);
}
}