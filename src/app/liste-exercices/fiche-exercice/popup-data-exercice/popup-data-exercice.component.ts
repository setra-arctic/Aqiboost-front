import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Uuid } from 'aws-sdk/clients/groundstation';
import { FicheExerciceService } from '../fiche-exercice.service';
import { PopupDataExerciceService } from './popup-data-exercice.service';

@Component({
  selector: 'app-popup-data-exercice',
  templateUrl: './popup-data-exercice.component.html',
  styleUrls: ['./popup-data-exercice.component.css'],
})
export class PopupDataExerciceComponent implements OnInit {
  groupe_data: FormGroup;
  lib_btn_data = 'Ajouter';
  lib_btn_ajout_data = "Ajouter à l'exercice";
  id_data: Uuid;
  lib_data: '';
  list_data = [];
  list_exercice_data = [];
  index_data = 0;
  type_data = '';
  fichier_audio: any;
  fichier_video: any;
  fichier_image: any;
  url_fichier: any = [];
  nom_fichier: '';
  type_image = false;
  type_audio = false;
  type_video = false;
  enreg_exercice_data: any = [];

  constructor(
    private form_builder: FormBuilder,
    private base_exercice: FicheExerciceService,
    private exercice_data: PopupDataExerciceService
  ) {}

  ngOnInit(): void {
    this.groupe_data = this.form_builder.group({
      DataTexte: ['', [Validators.required]],
      DescriptifData: [],
      videoPlayer: [],
    });

    this.list_exercice_data.splice(0, this.list_exercice_data.length);
    this.exercice_data.getAllExerciceData('', '').subscribe((response) => {
      this.enreg_exercice_data = response;
      let index = -1;
      this.enreg_exercice_data.forEach((element) => {
        index++;
        if (element.TypeImage) {
          this.type_data = 'Image';
        }
        if (element.TypeAudio) {
          this.type_data = 'Audio';
        }
        if (element.TypeVideo) {
          this.type_data = 'Video';
        }
        this.list_exercice_data.push({
          num_ordre: index,
          id: element.id,
          type: this.type_data,
          texte: element.DataTexte,
          url: element.Memo,
          nom_fichier: element.NomFichier,
          texte_descriptif: element.DescriptifData,
        });
      });
    });
    this.groupe_data.patchValue({ DataTexte: '' });
    this.groupe_data.patchValue({ DescriptifData: '' });
    this.url_fichier = '';
    this.nom_fichier = '';
    this.type_image = false;
    this.type_audio = false;
    this.type_video = false;
    this.fichier_audio = '';
    this.fichier_image = '';
    this.fichier_video = '';
  }

  afficherType(id_exercice_data) {
    this.exercice_data
      .getExerciceData(id_exercice_data)
      .subscribe((response) => {
        let enreg = response;
        return enreg.TypeAudio;
      });
  }

  keyup_data(event) {
    if (this.lib_btn_data == 'Valider modification' && event == '') {
      this.lib_btn_data = 'Ajouter';
      this.groupe_data.patchValue({ DescriptifData: '' });
      this.id_data = '';
      this.url_fichier = '';
      this.nom_fichier = '';
      this.type_image = false;
      this.type_audio = false;
      this.type_video = false;
      this.fichier_audio = '';
      this.fichier_image = '';
      this.fichier_video = '';
    } else if (event != '') {
      this.lib_data = event;
    }
  }

  selection_type(type_selection) {
    if (type_selection == 0) {
      this.type_image = true;
      this.type_audio = false;
      this.type_video = false;
      this.type_data = 'Image';
    }
    if (type_selection == 1) {
      this.type_image = false;
      this.type_audio = true;
      this.type_video = false;
      this.type_data = 'Audio';
    }
    if (type_selection == 2) {
      this.type_image = false;
      this.type_audio = false;
      this.type_video = true;
      this.type_data = 'Video';
    }
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        if (this.type_audio) {
          this.fichier_audio = event.target.result;
        }
        if (this.type_image) {
          this.fichier_image = event.target.result;
        }
        if (this.type_video) {
          this.fichier_video = event.target.result;
        }
      };

      const file = event.target.files[0];
      this.base_exercice.uploadAvatar(file).subscribe((events) => {
        let result: any = [];

        result = events;
        this.url_fichier = result.body;
        if (this.url_fichier != undefined) {
          this.url_fichier = result.body.imageUrl;
          this.nom_fichier = result.body.nomOrigine;
        }
      });
    }
  }

  ajout_modif_data() {
    if (this.lib_data == undefined || this.lib_data == '') {
      alert('Texte ne doit pas être vide');
    } else {
      if (this.lib_btn_data == 'Ajouter') {
        // Ajout data
        this.exercice_data
          .searchExerciceData(this.lib_data)
          .subscribe((response) => {
            let enreg = response;
            if (enreg.length > 0) {
              alert('Data texte déja existant');
            } else {
              const enreg = this.groupe_data.value;
              enreg.DataMemo = this.url_fichier;
              enreg.NomFichier = this.nom_fichier;
              switch (this.type_data) {
                case 'Image':
                  enreg.TypeImage = true;
                  break;
                case 'Audio':
                  enreg.TypeAudio = true;
                  break;
                case 'Video':
                  enreg.TypeVideo = true;
                  break;
              }
              this.exercice_data.createExerciceData(enreg).subscribe((res) => {
                console.log(res);
                this.ngOnInit();
              });
            }
          });
      } else {
        // Modif data
        // Chercher les doublons

        this.exercice_data
          .searchExerciceDataId(this.id_data, this.lib_data)
          .subscribe((response) => {
            if (response > 0) {
              alert('Data texte déja existant');
            } else {
              const enreg = this.groupe_data.value;
              enreg.DataMemo = this.url_fichier;
              enreg.NomFichier = this.nom_fichier;
              switch (this.type_data) {
                case 'Image':
                  enreg.TypeImage = true;
                  enreg.TypeAudio = false;
                  enreg.TypeVideo = false;
                  break;
                case 'Audio':
                  enreg.TypeImage = false;
                  enreg.TypeAudio = true;
                  enreg.TypeVideo = false;
                  break;
                case 'Video':
                  enreg.TypeImage = false;
                  enreg.TypeAudio = false;
                  enreg.TypeVideo = true;
                  break;
              }
              this.exercice_data
                .modifExerciceData(this.id_data, enreg)
                .subscribe((response) => {
                  console.log(response);
                  this.ngOnInit();
                });
            }
          });
        // Modifier le data texte dans BaseExerciceData
        this.list_data.forEach((element) => {
          if (element.idExerciceData == this.id_data) {
            element.texte = this.lib_data;
          }
        });
      }
    }
  }

  afficher_pour_modif_data(id: Uuid) {
    this.id_data = id;
    this.exercice_data.getExerciceData(this.id_data).subscribe((response) => {
      let enreg = response;
      enreg.Type = this.type_data;
      this.enreg_exercice_data = enreg;
      this.groupe_data.patchValue({ DataTexte: enreg.DataTexte });
      this.groupe_data.patchValue({ DescriptifData: enreg.DescriptifData });
      this.lib_data = enreg.DataTexte;
      this.lib_btn_data = 'Valider modification';
      if (enreg.TypeImage == true) {
        this.selection_type(0);
      }
      if (enreg.TypeAudio == true) {
        this.selection_type(1);
      }
      if (enreg.TypeVideo == true) {
        this.fichier_video = enreg.DataMemo;
        this.selection_type(2);
      }
      this.url_fichier = enreg.DataMemo;
      this.nom_fichier = enreg.NomFichier;
    });
  }

  supprData(id_exercice_data: Uuid) {
    this.exercice_data
      .supprExerciceData(id_exercice_data)
      .subscribe((response) => {
        this.ngOnInit();
        this.enleverExerciceData(id_exercice_data);
        console.log(response);
      });
  }

  enleverExerciceData(id_exercice_data: Uuid) {
    let index = -1;
    let index_element = -1;
    this.list_data.forEach((element) => {
      index++;
      if (element.idExerciceData == id_exercice_data) {
        index_element = index;
      }
    });
    if (index_element > -1) {
      this.list_data.splice(index_element, 1);
      index = 0;
      this.list_data.forEach((element) => {
        index++;
        element.num_ordre = index;
      });
    }
  }

  ajoutBaseExerciceData(id_exercice_data, data_texte) {
    let enreg_exist = false;
    this.list_data.forEach((element) => {
      if (element.idExerciceData == id_exercice_data) {
        enreg_exist = true;
      }
    });
    if (enreg_exist == false) {
      this.list_data.push({
        num_ordre: this.list_data.length + 1,
        texte: data_texte,
        idExerciceData: id_exercice_data,
      });
    }
  }
}
