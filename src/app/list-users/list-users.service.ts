import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment_aqiboost'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListUsersService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(`${environment.apiUrl}/showallusers`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteuser(id: number) {
    return this.http.delete(`${environment.apiUrl}/deleteuser/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

}
