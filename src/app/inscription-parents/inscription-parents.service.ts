import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment_aqiboost';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Injectable({
  providedIn: 'root',
})
export class InscriptionParentsService {
  constructor(private http: HttpClient) {}

  findParentEmail(email: '') {
    return this.http.get(`${environment.apiUrl}/parent_email/` + email).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  httpPost(url, {}) {
    return this.http.post(url, { name: 'Aqiboost' });
  }

  sendEmail(url, data) {
    return this.http.post(url, data);
  }

  searchParentById(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/parent_id/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createParent(enreg) {
    return this.http.post(`${environment.apiUrl}/create_parent/`, enreg).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  majParent(id: Uuid, enreg) {
    return this.http
      .put(`${environment.apiUrl}/update_parent/` + id, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  deleteParent(id: Uuid) {
    return this.http.delete(`${environment.apiUrl}/delete_parent/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  createEnfant(enreg) {
    return this.http.post(`${environment.apiUrl}/create_enfant/`, enreg).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  listeEnfant(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/enfant/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getEnfant(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/get_enfant/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateEnfant(id: Uuid, enreg) {
    return this.http
      .put(`${environment.apiUrl}/update_enfant/` + id, enreg)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  delete_Enfant(id: Uuid) {
    return this.http.delete(`${environment.apiUrl}/delete_enfant/` + id).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  create(card) {
    return this.http.post(`${environment.apiUrl}/order`, card).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  stripePayment(card) {
    return this.http
      .post(`${environment.apiUrl}/create-payment-intent`, card)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  addPayment(enreg) {
    return this.http.post(`${environment.apiUrl}/create_payment`, enreg).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getParentPayment(id_parent) {
    return this.http
      .get(`${environment.apiUrl}/get_paiement_parent/` + id_parent)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  searchEnfant(id_enfant) {
    return this.http
      .get(`${environment.apiUrl}/search_enfant/` + id_enfant)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
