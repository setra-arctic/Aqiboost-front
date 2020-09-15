import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment_aqiboost';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Injectable({
  providedIn: 'root',
})
export class PopupDataExerciceService {
  constructor(private http: HttpClient) {}

  createExerciceData(enreg) {
    return this.http
      .post(`${environment.apiUrl}/ajout_exercice_data`, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  searchExerciceData(nom_exercice: '') {
    return this.http
      .get(`${environment.apiUrl}/find_exercice_data/` + nom_exercice)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  searchExerciceDataId(id: Uuid, nom_exercice: '') {
    return this.http
      .get(
        `${environment.apiUrl}/find_exercice_data_id/` + id + '/' + nom_exercice
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  modifExerciceData(id: Uuid, enreg) {
    return this.http
      .put(`${environment.apiUrl}/update_exercice_data/` + id, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getExerciceData(id: Uuid) {
    return this.http
      .get(`${environment.apiUrl}/find_an_exercice_data/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  supprExerciceData(id: Uuid) {
    return this.http
      .delete(`${environment.apiUrl}/delete_exercice_data/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getAllExerciceData(text, list_id) {
    return this.http
      .get(
        `${environment.apiUrl}/afficher_exercice_data/?data_texte=` +
          text +
          '&list_id=' +
          list_id
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getTag(id: Uuid) {
    return this.http
      .get(`${environment.apiUrl}/get_tag_exercicedata/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
