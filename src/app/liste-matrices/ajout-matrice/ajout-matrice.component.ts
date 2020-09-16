import { DataService } from './../../data/data.service';
import { FicheExerciceService } from './../../liste-exercices/fiche-exercice/fiche-exercice.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ɵConsole } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AjoutMatriceService } from './ajout-matrice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajout-matrice',
  templateUrl: './ajout-matrice.component.html',
  styleUrls: ['./ajout-matrice.component.css'],
})
export class AjoutMatriceComponent implements OnInit {
  FormAjoutMatrice: FormGroup;
  groupe_tag: FormGroup;
  popupPE: FormGroup;
  ModeOverture: string;
  id: '';
  titre_form_matrice: string;
  enreg: any = [];
  url: any;
  url_image: any = [];
  image_url: '';
  closeResult = '';
  listeParamEntree: any = [];
  listeParamSortie: any = [];
  list_tag: any = [];
  enreg_tag: any = [];
  ajoutModifParam = 'Ajouter';
  typeParam = 'Entree';
  lib_btn_tag = 'Ajouter';
  id_tag: '';
  lib_tag = '';
  index_tag = 0;

  constructor(
    private matrice_service: AjoutMatriceService,
    private router: Router,
    private form_builder: FormBuilder,
    private modalService: NgbModal,
    private Toast: ToastrService,
    private route: ActivatedRoute,
    private tag: FicheExerciceService,
    private tagService: DataService
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.FormAjoutMatrice = this.form_builder.group({
      Titre_matrice: ['', [Validators.required]],
      Descriptif_matrice: [],
      Numero_matrice: [],
      NomPage: [],
      PhotoMatrice: [],
    });

    this.groupe_tag = this.form_builder.group({
      tag: [],
    });

    this.popupPE = this.form_builder.group({
      nomPE: [],
      valeurPE: [],
    });

    if (this.id == '') {
      this.titre_form_matrice = 'Ajout matrice';
    } else if (this.id != '') {
      this.titre_form_matrice = 'Modif matrice';
      this.matrice_service.Get_matrice(this.id).subscribe(
        (response) => {
          this.enreg = response;
          this.FormAjoutMatrice.patchValue({
            Titre_matrice: this.enreg.Titre,
            Descriptif_matrice: this.enreg.DescriptifMatrice,
            Numero_matrice: this.enreg.NumeroMatrice,
            NomPage: this.enreg.NomPage,
          });
          this.listeParamEntree = this.enreg.ParametresEntree;
          this.listeParamSortie = this.enreg.ParametresSortie;
          if (this.enreg.Image_ != '') {
            this.url = this.enreg.Image_;
          }

          // Afficher les tags associés
          this.matrice_service
            .getTagMatriceExercice(this.id)
            .subscribe((res) => {
              res.forEach((element) => {
                this.tagService.getATag(element.idTag).subscribe((resTag) => {
                  this.list_tag.push({
                    id: resTag.id,
                    tag: resTag.tag,
                  });
                });
              });
            });
        },
        (err) => {
          alert('Error');
        }
      );
    }

    this.tag.getAllTags().subscribe((res) => {
      this.enreg_tag = res;
    });
  }

  ajout_matrice_exercice() {
    const data = this.FormAjoutMatrice.value;
    if (this.id == '') {
      // Ajout
      this.matrice_service
        .Cherche_titre_matrice_noId(data.Titre_matrice)
        .subscribe((response) => {
          if (response == '') {
            const enreg = this.FormAjoutMatrice.value;
            enreg.url_image = this.image_url;
            enreg.ParamEntree = this.listeParamEntree;
            enreg.ParamSortie = this.listeParamSortie;
            console.log(this.listeParamSortie);
            this.matrice_service.Ajout_matrice(enreg).subscribe(
              (response) => {
                // ADD TagMatriceExercice
                this.list_tag.forEach((element) => {
                  let enreg: any = {};
                  enreg.idTag = element.id;
                  enreg.idMatriceExercice = this.id;
                  this.matrice_service
                    .createTagMatriceExercice(enreg)
                    .subscribe();
                });

                this.router.navigate(['/liste_matrices']);
              },
              (error) => {
                alert('Error');
              }
            );
          } else {
            alert('Titre matrice déjà existant');
          }
        });
    } else if (this.id != '') {
      // Modif
      this.matrice_service
        .Cherche_titre_matrice(data.Titre_matrice, this.id)
        .subscribe((response) => {
          if (response == '') {
            const enreg = this.FormAjoutMatrice.value;
            enreg.url_image = this.image_url;
            enreg.ParamEntree = this.listeParamEntree;
            enreg.ParamSortie = this.listeParamSortie;
            this.matrice_service.Modif_matrice(this.id, enreg).subscribe(
              (response) => {
                // MAJ TagMatriceExercice
                this.matrice_service
                  .deleteTagMatriceExercice(this.id)
                  .subscribe(() => {
                    this.list_tag.forEach((element) => {
                      let enreg: any = {};
                      enreg.idTag = element.id;
                      enreg.idMatriceExercice = this.id;
                      this.matrice_service
                        .createTagMatriceExercice(enreg)
                        .subscribe();
                    });
                  });

                this.router.navigate(['/liste_matrices']);
              },
              (error) => {
                alert('Error');
              }
            );
          } else {
            alert('Titre matrice déjà existant');
          }
        });
    }
  }

  // upload image
  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
      };

      const file = event.target.files[0];
      this.matrice_service.uploadAvatar(file).subscribe((events) => {
        let result: any = [];

        result = events;
        this.url_image = result.body;
        if (this.url_image != undefined) {
          this.image_url = result.body.imageUrl;
        }
      });
    }
  }

  onFileChanged(event) {
    const file = event.target.files[0];
  }

  supprImage() {
    this.url = '';
    this.image_url = '';
  }

  open(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'sl' })
      .result.then(
        (result) => {
          if (result == 'ajoutPE') {
            let res: any = [];
            res = this.popupPE.value;
            this.ajoutParamEntree(res.nomPE, res.valeurPE);
          }
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

  ajoutParamEntree(nom, valeur) {
    let paramExistant = false;
    let i = -1;
    let j = i;

    if (this.typeParam == 'Entree') {
      if (!nom) {
      } else {
        this.listeParamEntree.forEach((element) => {
          i++;
          if (element.nom == nom) {
            paramExistant = true;
            j = i;
          }
        });
        if (!paramExistant) {
          if (
            this.listeParamEntree.push({
              nom: nom,
              valeur: valeur,
            }) > 0
          ) {
            this.popupPE.reset();
          }
        } else {
          if (this.ajoutModifParam == 'Ajouter') {
            this.Toast.error('Paramètre déjà existant', '', {
              timeOut: 2000,
              positionClass: 'toast-top-center',
            });
          } else {
            if (j >= 0) {
              this.listeParamEntree[j].nom = nom;
              this.listeParamEntree[j].valeur = valeur;
              this.ajoutModifParam = 'Ajouter';
              this.popupPE.reset();
            }
          }
        }
      }
    } else if (this.typeParam == 'Sortie') {
      if (!nom) {
      } else {
        this.listeParamSortie.forEach((element) => {
          i++;
          if (element.nom == nom) {
            paramExistant = true;
            j = i;
          }
        });
        if (!paramExistant) {
          if (
            this.listeParamSortie.push({
              nom: nom,
              valeur: valeur,
            }) > 0
          ) {
            this.popupPE.reset();
          }
        } else {
          if (this.ajoutModifParam == 'Ajouter') {
            this.Toast.error('Paramètre déjà existant', '', {
              timeOut: 2000,
              positionClass: 'toast-top-center',
            });
          } else {
            if (j >= 0) {
              this.listeParamSortie[j].nom = nom;
              this.listeParamSortie[j].valeur = valeur;
              this.ajoutModifParam = 'Ajouter';
              this.popupPE.reset();
            }
          }
        }
      }
    }
  }

  afficherPE(nom, valeur) {
    this.popupPE.patchValue({
      nomPE: nom,
      valeurPE: valeur,
    });
    this.ajoutModifParam = 'Modifier le paramètre';
  }

  supprParam(nom) {
    let i = -1;
    let j = i;

    switch (this.typeParam) {
      case 'Entree':
        this.listeParamEntree.forEach((element) => {
          i++;
          if (element.nom == nom) {
            j = i;
          }
        });
        if (j >= 0) {
          this.listeParamEntree.splice(j, 1);
        }
        break;
      case 'Sortie':
        this.listeParamSortie.forEach((element) => {
          i++;
          if (element.nom == nom) {
            j = i;
          }
        });
        if (j >= 0) {
          this.listeParamSortie.splice(j, 1);
        }
        break;
    }
  }

  changeTypeParam(typeParam) {
    this.typeParam = typeParam;
    this.ajoutModifParam = 'Ajouter';
    this.popupPE.reset();
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
    if (!this.lib_tag) {
      alert('Tag ne doit pas être vide');
    } else {
      if (this.lib_btn_tag == 'Ajouter') {
        // Ajout tag
        this.tag.findTagName(this.lib_tag).subscribe((response) => {
          const enreg = response;
          if (enreg.length > 0) {
            alert('Tag déjà existant');
          } else {
            this.tag.newTag(this.groupe_tag.value).subscribe(() => {
              this.tag.getAllTags().subscribe((response) => {
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
        this.tag.findTagNameId(this.id_tag, this.lib_tag).subscribe((res) => {
          if (res.length == 0) {
            let idTag = this.id_tag;
            let libTag = this.lib_tag;
            this.tag
              .updateTag(this.id_tag, this.groupe_tag.value)
              .subscribe(() => {
                this.tag.getAllTags().subscribe((response) => {
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
    this.tag.deleteTag(id_tag).subscribe(() => {
      this.tag.getAllTags().subscribe((response) => {
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
    this.tag.getAllTags().subscribe((response) => {
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
}
