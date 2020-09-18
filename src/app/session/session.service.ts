import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment_aqiboost';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  constructor(private http: HttpClient) {}

  getSessions() {
    return this.http.get(`${environment.apiUrl}/getSessions`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getASession(id) {
    return this.http.get(`${environment.apiUrl}/getASession/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  addSession(enreg) {
    return this.http.post(`${environment.apiUrl}/createSession`, enreg).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  modifSession(id, enreg) {
    return this.http
      .put(`${environment.apiUrl}/updateSession/` + id, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  supprSession(id) {
    return this.http.delete(`${environment.apiUrl}/deleteSession/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getSessionsBySequence(sequenceId) {
    return this.http
      .get(`${environment.apiUrl}/getSessionsBySequence/` + sequenceId)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
