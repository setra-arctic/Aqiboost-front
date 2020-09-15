import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment_aqiboost';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EspaceEnfantService {
  constructor(private http: HttpClient) {}

  getEnfantByIdentifiant(identifiant: '') {
    return this.http
      .get(`${environment.apiUrl}/get_enfant_identifiant/` + identifiant)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  verifyPWD(id, pwd) {
    return this.http
      .get(`${environment.apiUrl}/enfant_pwd/` + id + '/' + pwd)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
