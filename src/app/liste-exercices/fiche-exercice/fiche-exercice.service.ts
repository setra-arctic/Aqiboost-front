import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment_aqiboost'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Injectable({
  providedIn: 'root'
})
export class FicheExerciceService {

  constructor(private http: HttpClient) { }

  ShowBaseExercice(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/one_base_exercice/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  GetFamilles() {
    return this.http.get(`${environment.apiUrl}/showfamilles`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  AddFamille(famille: any) {
    return this.http.post(`${environment.apiUrl}/createfamille`, famille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  ModifFamille(famille: any, id: Uuid) {
    return this.http.put(`${environment.apiUrl}/edit_famille/` + id, famille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  DeleteFamille(id: Uuid) {
    return this.http.delete(`${environment.apiUrl}/deletefamille/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  GetSousFamilles(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/showsousfamilles?id_famille=` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }


  AddSousFamille(sous_famille: any) {
    return this.http.post(`${environment.apiUrl}/createsousfamille`, sous_famille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  ModifSousFamille(sous_famille: any, id_sous_famille: Uuid) {
    return this.http.put(`${environment.apiUrl}/update_sous_famille/` + id_sous_famille, sous_famille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  ChercheNomSF(nom_sf: Text, id_famille: Uuid) {
    return this.http.get(`${environment.apiUrl}/cherche_nom_sf?sous_famille=` + nom_sf + "&id_famille=" + id_famille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  ChercheNomSFID(nom_sf: Text, id_famille: Uuid, id_sous_famille: Uuid) {
    return this.http.get(`${environment.apiUrl}/cherche_nom_sf_id?nom=` + nom_sf + "&id=" + id_sous_famille + "&id_f=" + id_famille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  SupprSousFamille(id: Uuid) {
    return this.http.delete(`${environment.apiUrl}/deleteasousfamille/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  ChercheNomFamille(NomFamille: Text) {
    return this.http.get(`${environment.apiUrl}/find_nom_famille?famille=` + NomFamille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  ChercheNomFamilleAvecid(NomFamille: Text, idFamille: Uuid) {
    return this.http.get(`${environment.apiUrl}/find_nom_famille_avec_id?famille=` + NomFamille + "&id=" + idFamille)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getAllNiveau() {
    return this.http.get(`${environment.apiUrl}/get_all_niveau_exercice`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  AjoutNiveau(enreg: any) {
    return this.http.post(`${environment.apiUrl}/create_niveau_exercice`, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getNiveauExercice(niveau: '') {
    return this.http.get(`${environment.apiUrl}/get_niveau_exercice?niveau=` + niveau)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }
  getNiveauExerciceId(niveau: '', id_niveau: Uuid) {
    return this.http.get(`${environment.apiUrl}/get_niveau_exercice_id?niveau=` + niveau + "&id_niveau=" + id_niveau)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  modifNiveauExercice(id_niveau: Uuid, niveau: any) {
    return this.http.put(`${environment.apiUrl}/update_niveau_exercice/` + id_niveau, niveau)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  supprNiveau(id_niveau: Uuid) {
    return this.http.delete(`${environment.apiUrl}/delete_niveau_exercice/` + id_niveau)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getMatriceExercices() {
    return this.http.get(`${environment.apiUrl}/show_matrice_exercices`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${environment.apiUrl}/avatars`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  enregExerciceData(enreg) {
    return this.http.post(`${environment.apiUrl}/create_base_exercice`, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getAllTags() {
    return this.http.get(`${environment.apiUrl}/find_all_tags`)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  newTag(new_tag) {
    return this.http.post(`${environment.apiUrl}/createtag`, new_tag)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  findTagName(nom_tag) {
    return this.http.get(`${environment.apiUrl}/find_tag_name/` + nom_tag)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  findTagNameId(id_tag, nom_tag) {
    return this.http.get(`${environment.apiUrl}/find_tag_name_id/` + id_tag + "/" + nom_tag)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  updateTag(id_tag, enreg) {
    return this.http.put(`${environment.apiUrl}/update_tag/` + id_tag, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteTag(id_tag) {
    return this.http.delete(`${environment.apiUrl}/delete_tag/` + id_tag)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getTagBaseExercices(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/tag_base_exercices/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  createBaseNiveauExercice(enreg) {
    return this.http.post(`${environment.apiUrl}/create_base_niveau_exercice`, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getBaseNiveauExercice(id_base_niveau_exercice) {
    return this.http.get(`${environment.apiUrl}/get_base_niveau_exercice/` + id_base_niveau_exercice)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  updateBaseExercice(id_base_exercice, enreg: any) {
    return this.http.put(`${environment.apiUrl}/update_base_exercice/` + id_base_exercice, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteBaseNiveauExercice(id: Uuid) {
    return this.http.delete(`${environment.apiUrl}/delete_base_niveau_exercice_idbaseexercice/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  createTagBaseExercice(enreg) {
    return this.http.post(`${environment.apiUrl}/create_tag_base_exercice`, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteTagBaseExercice(id: Uuid) {
    return this.http.delete(`${environment.apiUrl}/delete_tag_base_exercice/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  findTagNameById(id: Uuid) {
    return this.http.get(`${environment.apiUrl}/findatag/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getBaseExerciceData(id_base_exercice: Uuid) {
    return this.http.get(`${environment.apiUrl}/base_exercice_data/` + id_base_exercice)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  getExerciceData(id_exercice_data: Uuid) {
    return this.http.get(`${environment.apiUrl}/find_an_exercice_data/` + id_exercice_data)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  createBaseExerciceData(enreg) {
    return this.http.post(`${environment.apiUrl}/create_base_exercice_data`, enreg)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  deleteBaseExerciceData(id) {
    return this.http.delete(`${environment.apiUrl}/delete_base_exercice_data/` + id)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  findBaseExercice(titre: '') {
    return this.http.get(`${environment.apiUrl}/find_base_exercice/` + titre)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }

  findBaseExerciceId(id: Uuid, titre: '') {
    return this.http.get(`${environment.apiUrl}/find_base_exercice_id/` + id + "/" + titre)
      .pipe(map(
        (response: any) => {
          return response;
        }
      ));
  }
}
