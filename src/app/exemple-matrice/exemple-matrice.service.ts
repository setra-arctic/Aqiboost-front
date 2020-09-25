import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment_aqiboost';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Injectable({
  providedIn: 'root',
})
export class ExempleMatriceService {
  constructor(private http: HttpClient) {}

  getBaseExerciceData(id_base_exercice: Uuid) {
    return this.http
      .get(`${environment.apiUrl}/base_exercice_data/` + id_base_exercice)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getAudioExerciceData(id: Uuid) {
    return this.http
      .get(`${environment.apiUrl}/audio_exercice_data/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  enregKey(listKey) {
    return this.http.post(`${environment.apiUrl}/setKeyBoard`, listKey).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getKey() {
    return this.http.get(`${environment.apiUrl}/getKeyBoard`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  listerExercicesEnfant(id) {
    return this.http.get(`${environment.apiUrl}/listEnfantExercice/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
