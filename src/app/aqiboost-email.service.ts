import { environment } from './../environments/environment_aqiboost';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Injectable({
  providedIn: 'root'
})
export class AqiboostEmailService {

  constructor(private http: HttpClient) { }

  send_email(user: any) {
    return this.http.post(`${environment.apiUrl}/sendmail/`, user)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }
}
