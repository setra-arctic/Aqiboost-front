import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment_aqiboost'

@Injectable({
  providedIn: 'root'
})
export class ListeExercicesService {

  constructor(private http: HttpClient) { }

  getBaseExercices() {
    return this.http.get(`${environment.apiUrl}/base_exercices`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteBaseExercice(id_base_exercice) {
    return this.http.delete(`${environment.apiUrl}/delete_base_exercice/` + id_base_exercice)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }
}
