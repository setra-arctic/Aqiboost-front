import { map } from 'rxjs/operators';
import { Uuid } from 'aws-sdk/clients/groundstation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment_aqiboost';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  createTagExerciceData(enreg) {
    return this.http
      .post(`${environment.apiUrl}/createtagexercicedata`, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getTag(idExerciceData) {
    return this.http
      .get(`${environment.apiUrl}/get_tag_exercicedata/` + idExerciceData)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getATag(idTag) {
    return this.http.get(`${environment.apiUrl}/findatag/` + idTag).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteTags(idExerciceData) {
    return this.http
      .delete(`${environment.apiUrl}/deleteTags/` + idExerciceData)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  getTagExerciceDataId(data_texte) {
    return this.http
      .get(`${environment.apiUrl}/TagExerciceDataId/?data_texte=` + data_texte)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  findExercices(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/find_exercices/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
