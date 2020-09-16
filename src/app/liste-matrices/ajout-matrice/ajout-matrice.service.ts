import { Uuid } from 'aws-sdk/clients/groundstation';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment_aqiboost';

@Injectable({
  providedIn: 'root',
})
export class AjoutMatriceService {
  constructor(private http: HttpClient) {}

  Ajout_matrice(enreg: any) {
    return this.http
      .post(`${environment.apiUrl}/ajout_matrice_exercice`, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  Modif_matrice(id: '', enreg: any) {
    return this.http
      .put(`${environment.apiUrl}/update_matrice_exercice/` + id, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  Get_matrice(id: Uuid) {
    return this.http
      .get(`${environment.apiUrl}/get_a_matrice_exercice/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  Cherche_titre_matrice(titre_matrice: Text, id: Text) {
    return this.http
      .get(
        `${environment.apiUrl}/find_titre_matrice_exercice?exo_titre=` +
          titre_matrice +
          '&id_matrice=' +
          id
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  Cherche_titre_matrice_noId(titre_matrice: Text) {
    return this.http
      .get(
        `${environment.apiUrl}/find_titre_noId_matrice_exercice?exo_titre=` +
          titre_matrice
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/avatars`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getTagMatriceExercice(id: Uuid) {
    return this.http
      .get(`${environment.apiUrl}/get_tag_matrice_exercice/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteTagMatriceExercice(id: Uuid) {
    return this.http
      .delete(`${environment.apiUrl}/delete_tag_matrice_exercice/` + id)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  createTagMatriceExercice(enreg) {
    return this.http
      .post(`${environment.apiUrl}/create_tag_matrice_exercice`, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
