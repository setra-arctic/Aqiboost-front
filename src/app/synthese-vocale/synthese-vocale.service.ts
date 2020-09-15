import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment_aqiboost'

@Injectable({
  providedIn: 'root'
})
export class SyntheseVocaleService {

  constructor(private http: HttpClient) { }

  createSynth(payload: any) {
    return this.http.post(`${environment.apiUrl}/GenerateVocalData`, payload)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  delete() {
    return this.http.delete(`${environment.apiUrl}/DeleteOne`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteall() {
    return this.http.delete(`${environment.apiUrl}/deletealltexts`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getOne(id: number) {
    return this.http.get(`${environment.apiUrl}/findonetext/` + id)
  }

  getExerciceData() {
    return this.http.get(`${environment.apiUrl}/afficher_exercice_data`)
  }

  getTextToSynth() {
    return this.http.get(`${environment.apiUrl}/AllTextToSynth`)
  }

  addExerciceData(enreg) {
    return this.http.post(`${environment.apiUrl}/ajout_exercice_data`, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  updateExerciceData(enreg, id_exercice: '') {
    return this.http.put(`${environment.apiUrl}/update_exercice_data/` + id_exercice, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteExerciceData(id_exercice: '') {

    return this.http.delete(`${environment.apiUrl}/delete_exercice_data/` + id_exercice)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }
}
