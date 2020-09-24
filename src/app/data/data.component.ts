import { DataService } from './data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PopupDataExerciceService } from './../liste-exercices/fiche-exercice/popup-data-exercice/popup-data-exercice.service';
import { FicheExerciceService } from './../liste-exercices/fiche-exercice/fiche-exercice.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css'],
})
export class DataComponent implements OnInit {
  groupe_data: FormGroup;
  groupe_tag: FormGroup;
  lib_btn_data = 'Ajouter';
  lib_btn_ajout_data = 'Ajouter au data';
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
  list_tag = [];
  closeResult = '';
  lib_btn_tag = 'Ajouter';
  id_tag = '';
  lib_tag = '';
  enreg_tag: any = [];
  index_tag = 0;
  tagExist = true;
  texteAChercher = '';
  listIdExerciceData = [];
  data_selected = '';
  liste_exercice = [];
  nom_data = '';

  constructor(
    private form_builder: FormBuilder,
    private base_exercice: FicheExerciceService,
    private exercice_data: PopupDataExerciceService,
    private modalService: NgbModal,
    private dataTag: DataService
  ) {}

  ngOnInit(): void {
    this.groupe_data = this.form_builder.group({
      DataTexte: ['', [Validators.required]],
      DescriptifData: [],
      videoPlayer: [],
      Tag: [],
    });

    this.groupe_tag = this.form_builder.group({
      tag: ['', [Validators.required]],
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
    this.list_tag.splice(0, this.list_tag.length);

    // Remplir Tag
    this.base_exercice.getAllTags().subscribe((response) => {
      this.enreg_tag = response;
    });
    this.lib_btn_tag = 'Ajouter';
  }

  afficherType(id_exercice_data) {
    this.exercice_data
      .getExerciceData(id_exercice_data)
      .subscribe((response) => {
        let enreg = response;
        return enreg.TypeAudio;
      });
  }

  RAZ() {
    this.lib_btn_data = 'Ajouter';
    this.groupe_data.patchValue({
      DataTexte: '',
      DescriptifData: '',
    });
    this.id_data = '';
    this.url_fichier = '';
    this.nom_fichier = '';
    this.type_image = false;
    this.type_audio = false;
    this.type_video = false;
    this.fichier_audio = '';
    this.fichier_image = '';
    this.fichier_video = '';
    this.list_tag.splice(0, this.list_tag.length);
  }

  keyup_data(event) {
    if (this.lib_btn_data == 'Valider modification' && event == '') {
      this.RAZ();
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
        console.log(this.url_fichier);
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
                // Enregistrer les tags
                let enregTag: any = {};
                if (this.list_tag.length > 0) {
                  this.list_tag.forEach((element) => {
                    enregTag.idExerciceData = res.id;
                    enregTag.idTag = element.id;
                    this.dataTag
                      .createTagExerciceData(enregTag)
                      .subscribe((res) => {
                        console.log(res);
                      });
                  });
                }

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
            if (response.length > 0) {
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
                  this.dataTag.deleteTags(this.id_data).subscribe((resp) => {});
                  // Enregistrer les tags
                  let enregTag: any = {};
                  if (this.list_tag.length > 0) {
                    this.list_tag.forEach((element) => {
                      enregTag.idExerciceData = this.id_data;
                      enregTag.idTag = element.id;
                      this.dataTag
                        .createTagExerciceData(enregTag)
                        .subscribe((res) => {
                          console.log(res);
                        });
                    });
                  }
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
    this.list_tag.splice(0, this.list_tag.length);

    this.id_data = id;
    this.exercice_data.getExerciceData(this.id_data).subscribe((response) => {
      let enreg = response;
      enreg.Type = this.type_data;
      this.enreg_exercice_data = enreg;
      this.groupe_data.patchValue({ DataTexte: enreg.DataTexte });
      this.groupe_data.patchValue({ DescriptifData: enreg.DescriptifData });
      this.exercice_data.getTag(this.id_data).subscribe((res) => {});
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
      // lister les tags associés
      this.dataTag.getTag(this.id_data).subscribe((res) => {
        res.forEach((element) => {
          this.dataTag.getATag(element.idTag).subscribe((resTag) => {
            this.list_tag.push({
              id: resTag.id,
              tag: resTag.tag,
            });
          });
        });
      });
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

  open(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ajoutTagData(idTag, NomTag) {
    this.list_tag.push({
      id: idTag,
      tag: NomTag,
    });
    this.verifyTagExist(idTag);
  }

  verifyTagExist(idTag) {
    let indexTag = false;
    this.list_tag.forEach((element) => {
      if (element.id == idTag) {
        indexTag = true;
      }
    });
    return indexTag;
  }

  searchData(texte) {
    this.RAZ();
    // Chercher dans les tags
    this.dataTag.getTagExerciceDataId(texte).subscribe((response) => {
      this.listIdExerciceData = response;

      this.list_exercice_data.splice(0, this.list_exercice_data.length);
      this.exercice_data
        .getAllExerciceData(texte, this.listIdExerciceData)
        .subscribe((response) => {
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
    });
  }

  keyDownFunction(event, text) {
    if (event.keyCode === 13) {
      this.searchData(text);
      return false;
    }
  }

  click_tr(exercice, nom_data) {
    this.data_selected = exercice;
    this.dataTag.findExercices(exercice).subscribe((res) => {
      this.liste_exercice = res;
      this.nom_data = nom_data;
    });
  }

  // -------------------------------------TAG--------------------------------
  keyup_tag(event) {
    if (this.lib_btn_tag == 'Valider modification' && event == '') {
      this.lib_btn_tag = 'Ajouter';
      this.id_tag = '';
    } else if (event != '') {
      this.lib_tag = event;
    }
  }

  ajout_modif_tag() {
    if (this.lib_tag == '' || this.lib_tag == undefined) {
      alert('Tag ne doit pas être vide');
    } else {
      if (this.lib_btn_tag == 'Ajouter') {
        // Ajout tag
        this.base_exercice.findTagName(this.lib_tag).subscribe((response) => {
          const enreg = response;
          if (enreg.length > 0) {
            alert('Tag déjà existant');
          } else {
            this.base_exercice.newTag(this.groupe_tag.value).subscribe(() => {
              this.base_exercice.getAllTags().subscribe((response) => {
                this.enreg_tag = response;
              });
              this.id_tag = '';
              this.groupe_tag.patchValue({ tag: '' });
              this.lib_tag = '';
            });
          }
        });
      } else {
        // Modif tag
        // Chercher les doublons
        this.base_exercice
          .findTagNameId(this.id_tag, this.lib_tag)
          .subscribe((res) => {
            if (res.length == 0) {
              let idTag = this.id_tag;
              let libTag = this.lib_tag;
              this.base_exercice
                .updateTag(this.id_tag, this.groupe_tag.value)
                .subscribe(() => {
                  this.base_exercice.getAllTags().subscribe((response) => {
                    this.enreg_tag = response;
                    // Maj TagBaseExercice
                    this.list_tag.forEach((element) => {
                      if (element.id == idTag) {
                        element.nom = libTag;
                      }
                    });
                  });
                  this.id_tag = '';
                  this.groupe_tag.patchValue({ tag: '' });
                  this.lib_tag = '';
                  this.lib_btn_tag = 'Ajouter';
                });
            } else {
              alert('Tag déja existant');
            }
          });
      }
    }
  }

  afficher_pour_modif_tag(id_tag, nom_tag: '') {
    this.groupe_tag.patchValue({ tag: nom_tag });
    this.lib_tag = nom_tag;
    this.id_tag = id_tag;
    this.lib_btn_tag = 'Valider modification';
    // Trouver l'index de l'élément à modifier
    let i = -1;
    this.list_tag.forEach((element) => {
      i++;
      if (element.nom == nom_tag) {
        this.index_tag = i;
      }
    });
  }

  supprTag(id_tag) {
    this.base_exercice.deleteTag(id_tag).subscribe(() => {
      this.base_exercice.getAllTags().subscribe((response) => {
        this.enreg_tag = response;
        let index = -1;
        let indexElement = -1;
        this.list_tag.forEach((element) => {
          index++;
          if (element.id == id_tag) {
            indexElement = index;
          }
        });
        if (indexElement > -1) {
          this.list_tag.splice(indexElement, 1);
        }
      });
    });
  }

  getAllTags() {
    this.base_exercice.getAllTags().subscribe((response) => {
      this.enreg_tag = response;
    });
  }

  ajoutTagExercice(id_tag, nom_tag) {
    let tag_exist = false;
    this.list_tag.forEach((element) => {
      if (element.id == id_tag) {
        tag_exist = true;
      }
    });
    if (tag_exist == false) {
      this.list_tag.push({
        nom: nom_tag,
        id: id_tag,
      });
    }
  }

  enleverTag(id_tag) {
    let index = -1;
    let index_tag = -1;
    this.list_tag.forEach((element) => {
      index++;
      if (element.id == id_tag) {
        index_tag = index;
      }
    });
    if (index_tag > -1) {
      this.list_tag.splice(index_tag, 1);
    }
  }
}
