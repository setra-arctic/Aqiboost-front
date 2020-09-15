import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment_aqiboost'


@Injectable({
  providedIn: 'root'
})
export class ListeMatricesService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${environment.apiUrl}/show_matrice_exercices`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  delete(id: '') {
    return this.http.delete(`${environment.apiUrl}/delete_matrice_exercice/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

}
