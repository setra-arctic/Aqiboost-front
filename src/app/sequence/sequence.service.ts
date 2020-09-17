import { Uuid } from 'aws-sdk/clients/groundstation';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment_aqiboost';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {
  constructor(private http: HttpClient) {}

  getSequences() {
    return this.http.get(`${environment.apiUrl}/getSequence`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getASequence(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/getASequence/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  addSequence(enreg) {
    return this.http.post(`${environment.apiUrl}/createSequence`, enreg).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateSequence(id, enreg) {
    return this.http
      .put(`${environment.apiUrl}/updateSequence/` + id, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteSequence(id) {
    return this.http.delete(`${environment.apiUrl}/deleteSequence/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
