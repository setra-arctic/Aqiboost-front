import { AjoutMatriceService } from './../../liste-matrices/ajout-matrice/ajout-matrice.service';
import { AqiboostDialogComponent } from './../../aqiboost-dialog/aqiboost-dialog.component';
import { PopupDataExerciceComponent } from './popup-data-exercice/popup-data-exercice.component';
import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FicheExerciceService } from './fiche-exercice.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Uuid } from 'aws-sdk/clients/groundstation';
import { splitClasses } from '@angular/compiler';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fiche-exercice',
  templateUrl: './fiche-exercice.component.html',
  styleUrls: ['./fiche-exercice.component.css'],
})
export class FicheExerciceComponent implements OnInit {
  fiche_exercice: FormGroup;
  groupe_famille: FormGroup;
  groupe_sous_famille: FormGroup;
  groupe_niveau: FormGroup;
  groupe_tag: FormGroup;
  groupe_data: FormGroup;
  titre_fiche_exercice: string;
  id: Uuid;
  enreg_base_exercice: any = [];
  enreg_famille: any = [];
  enreg_sous_famille: any = [];
  enreg_niveau: any = [];
  enreg_tag: any = [];
  enreg_matrice_exercice: any[];
  closeResult = '';
  lib_btn_valider_famille = 'Ajouter';
  lib_btn_valider_sf = 'Ajouter';
  lib_btn_niveau = 'Ajouter';
  lib_btn_tag = 'Ajouter';
  lib_btn_ajout_data = "Ajouter à l'exercice";
  id_famille: Uuid;
  id_sf: Uuid;
  id_niveau: Uuid;
  id_tag: Uuid;
  id_data: Uuid;
  id_famille_selected: Uuid;
  id_sf_selected: Uuid;
  id_famille_sf: Uuid;
  id_matrice_selected: Uuid;
  lib_sf: '';
  lib_famille: '';
  lib_niveau: '';
  lib_tag: '';
  lib_exercice: '';
  list_tag = [];
  list_data = [];
  index_tag = 0;
  index_data = 0;
  type_image = false;
  type_audio = false;
  type_video = false;
  type_data = '';
  fichier_audio: any;
  fichier_video: any;
  fichier_image: any;
  url_fichier: any = [];
  nom_fichier: '';
  NiveauChecked: any[] = [];
  modalRef: any;
  data_selected: any;
  listeParamEntree: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private form_builder: FormBuilder,
    private base_exercice: FicheExerciceService,
    private modalService: NgbModal,
    public dialog: MatDialog,
    private Toast: ToastrService,
    private matriceExercice: AjoutMatriceService
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.fiche_exercice = this.form_builder.group({
      Numero_exercice: 0,
      Titre_exercice: ['', [Validators.required]],
      Descriptif_exercice: '',
      tag: [],
      param_entree: '',
    });

    this.groupe_famille = this.form_builder.group({
      famille: ['', [Validators.required]],
    });

    this.groupe_sous_famille = this.form_builder.group({
      sous_famille: ['', [Validators.required]],
      id_famille: [],
    });

    this.groupe_niveau = this.form_builder.group({
      niveau: ['', [Validators.required]],
    });

    this.groupe_tag = this.form_builder.group({
      tag: ['', [Validators.required]],
    });

    this.groupe_data = this.form_builder.group({
      data_texte: ['', [Validators.required]],
      videoPlayer: [],
    });

    this.id_famille = '';
    this.lib_btn_valider_famille = 'Ajouter';
    this.lib_btn_valider_sf = 'Ajouter';
    this.id_niveau = '';
    this.lib_btn_niveau = 'Ajouter';
    // Remplir combo famille
    this.base_exercice.GetFamilles().subscribe(
      (response) => {
        // console.log(response)
        this.enreg_famille = response;
      },
      () => {
        alert('An error occured during retrieving data.');
      }
    );

    // Remplir combo sous famille
    this.base_exercice.GetSousFamilles(this.id_famille_selected).subscribe(
      (response) => {
        this.enreg_sous_famille = response;
      },
      () => {
        alert('An error occured during retrieving data.');
      }
    );

    // Remplir liste niveau
    this.base_exercice.getAllNiveau().subscribe((response) => {
      this.enreg_niveau = response;
    });

    // Remplir Tag
    this.base_exercice.getAllTags().subscribe((response) => {
      this.enreg_tag = response;
    });

    // Remplir Matrice Exercice
    this.base_exercice.getMatriceExercices().subscribe((response) => {
      this.enreg_matrice_exercice = response;
    });

    if (this.id == undefined || this.id == '') {
      this.titre_fiche_exercice = 'Ajout de base exercice';
    } else if (this.id != undefined) {
      this.titre_fiche_exercice = 'Modification de base exercice';
      let libExercice = '';
      this.base_exercice.ShowBaseExercice(this.id).subscribe(
        (response) => {
          this.enreg_base_exercice = response;
          this.fiche_exercice.patchValue({
            Numero_exercice: this.enreg_base_exercice.NumeroExercice,
            Titre_exercice: this.enreg_base_exercice.Titre,
            Descriptif_exercice: this.enreg_base_exercice.DescriptifExercice,
          });
          this.lib_exercice = this.enreg_base_exercice.Titre;
          // Famille
          this.id_famille_selected = this.enreg_base_exercice.IDFamille;

          // SousFamille
          this.id_famille_sf = this.enreg_base_exercice.IDFamille;
          this.base_exercice
            .GetSousFamilles(this.id_famille_selected)
            .subscribe(
              (response) => {
                this.enreg_sous_famille = response;
                this.id_sf_selected = this.enreg_base_exercice.IDSousFamille;
              },
              () => {
                alert('An error occured during retrieving data.');
              }
            );

          // Niveau
          this.base_exercice
            .getBaseNiveauExercice(this.id)
            .subscribe((res_base_niveau_exercice) => {
              let list_base_niveau_exercice = res_base_niveau_exercice;
              list_base_niveau_exercice.forEach((element) => {
                this.niveauSelected(element.idNiveauExercice);
              });
            });

          // Tag
          this.base_exercice.getTagBaseExercices(this.id).subscribe((res) => {
            let list_tag_base_exercice = res;
            list_tag_base_exercice.forEach((element) => {
              this.base_exercice
                .findTagNameById(element.idTag)
                .subscribe((res_tag) => {
                  this.list_tag.push({
                    nom: res_tag.tag,
                    id: element.idTag,
                  });
                });
            });
          });

          // Matrice exercice
          this.id_matrice_selected = this.enreg_base_exercice.IDMatriceExercice;
          if (!this.id_matrice_selected) {
          } else {
            this.matriceExercice
              .Get_matrice(this.id_matrice_selected)
              .subscribe((res) => {
                this.listeParamEntree = res.ParametresEntree;
              });
          }

          // BaseExerciceData
          this.base_exercice
            .getBaseExerciceData(this.id)
            .subscribe((response) => {
              let enreg_base_exercice = response;
              let numOrdre = 0;
              enreg_base_exercice.forEach((element) => {
                this.base_exercice
                  .getExerciceData(element.idExerciceData)
                  .subscribe((res) => {
                    let enreg_exercice_data = res;
                    numOrdre++;
                    this.list_data.push({
                      num_ordre: numOrdre,
                      texte: enreg_exercice_data.DataTexte,
                      idExerciceData: element.idExerciceData,
                      idBaseExercice: this.id,
                    });
                  });
              });
            });
        },
        () => {
          alert('An error occured during retrieving data.');
        }
      );
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

  ajout_modif_famille() {
    if (this.lib_famille == '' || this.lib_famille == undefined) {
      alert('Famille ne doit pas être vide');
    } else {
      if (this.id_famille == undefined || this.id_famille == '') {
        this.base_exercice
          .ChercheNomFamille(this.lib_famille)
          .subscribe((res) => {
            if (res.length == 0) {
              this.ajouter_famille();
            } else if (res.length > 0) {
              alert('Famille déjà existant');
            }
          });
      } else {
        this.base_exercice
          .ChercheNomFamilleAvecid(this.lib_famille, this.id_famille)
          .subscribe((res) => {
            if (res.length == 0) {
              this.modifier_famille(this.id_famille);
            } else {
              alert('Famille déjà existant');
            }
          });
      }
    }
  }

  ajouter_famille() {
    this.base_exercice.AddFamille(this.groupe_famille.value).subscribe(
      () => {
        this.ngOnInit();
      },
      () => {
        alert('Error');
      }
    );
  }

  modifier_famille(id_famille: Uuid) {
    this.base_exercice
      .ModifFamille(this.groupe_famille.value, id_famille)
      .subscribe(
        () => {
          this.ngOnInit();
        },
        () => {
          alert('Error');
        }
      );
  }

  afficher_pour_modif(nom_famille: '', id_famille: Uuid) {
    this.groupe_famille.patchValue({ famille: nom_famille });
    this.id_famille = id_famille;
    this.lib_famille = nom_famille;
    this.lib_btn_valider_famille = 'Valider modification';
  }

  supprimer_famille(id_famille: Uuid) {
    this.base_exercice.DeleteFamille(id_famille).subscribe(
      () => {
        this.Toast.info('Suppression famille OK', '', {
          timeOut: 3000,
          positionClass: 'toast-top-center',
        });
        this.ngOnInit();
      },
      () => {
        alert('Error');
      }
    );
  }

  keyup(event) {
    if (this.lib_btn_valider_famille == 'Valider modification' && event == '') {
      this.lib_btn_valider_famille = 'Ajouter';
      this.id_famille = '';
    } else if (event != '') {
      this.lib_famille = event;
    }
  }

  famille_selected(id_famille: Uuid) {
    this.id_famille_selected = id_famille;
    this.id_famille_sf = id_famille;
    this.base_exercice
      .GetSousFamilles(this.id_famille_selected)
      .subscribe((res) => {
        this.enreg_sous_famille = res;
      });
  }

  // --------------------------SOUS-FAMILLE--------------------------------
  ajouter_sous_famille() {
    if (this.id_famille_sf == undefined || this.id_famille_sf == '') {
      alert('Aucune famille sélectionnée');
    } else {
      if (this.lib_sf == undefined || this.lib_sf == '') {
        alert('Sous famille ne doit pas être vide');
      } else {
        // Chercher si sous famille déja existant
        this.base_exercice
          .ChercheNomSF(this.lib_sf, this.id_famille_sf)
          .subscribe((res) => {
            if (res.length == 0) {
              console.log(res.length);
              const enreg = this.groupe_sous_famille.value;
              enreg.id_famille = this.id_famille_sf;
              this.base_exercice
                .AddSousFamille(this.groupe_sous_famille.value)
                .subscribe(
                  (res) => {
                    // MAJ liste sous famille
                    this.maj_liste_sous_famille(this.id_famille_sf);
                  },
                  (err) => {
                    alert('Error : ' + err);
                  }
                );
            } else {
              alert('Sous famille déjà existante');
            }
          });
      }
    }
  }

  modifier_sous_famille(id_sous_famille: Uuid) {
    const enreg = this.groupe_sous_famille.value;

    this.base_exercice
      .ChercheNomSFID(enreg.sous_famille, this.id_famille_sf, id_sous_famille)
      .subscribe((res) => {
        if (res.length == 0) {
          enreg.id_famille = this.id_famille_sf;
          this.base_exercice
            .ModifSousFamille(this.groupe_sous_famille.value, id_sous_famille)
            .subscribe(
              () => {
                // MAJ liste sous famille
                this.maj_liste_sous_famille(this.id_famille_sf);
              },
              () => {
                alert('Error');
              }
            );
        } else {
          alert('Sous famille déjà existante');
        }
      });
  }

  afficher_pour_modif_sf(nom_sous_famille: Text, id_sous_famille: Uuid) {
    this.groupe_sous_famille.patchValue({ sous_famille: nom_sous_famille });
    this.id_sf = id_sous_famille;
    this.lib_btn_valider_sf = 'Valider modification';
  }

  ajout_modif_sf() {
    if (this.id_sf == undefined || this.id_sf == '') {
      this.ajouter_sous_famille();
    } else {
      this.modifier_sous_famille(this.id_sf);
    }
  }

  famille_sf_selected(id_famille: Uuid) {
    this.id_famille_sf = id_famille;
    this.base_exercice.GetSousFamilles(this.id_famille_sf).subscribe((res) => {
      this.enreg_sous_famille = res;
    });
  }

  keyup_sf(event) {
    if (this.lib_btn_valider_sf == 'Valider modification' && event == '') {
      this.lib_btn_valider_sf = 'Ajouter';
      this.id_sf = '';
    } else if (event != '') {
      this.lib_sf = event;
    }
  }

  suppr_sous_famille(id_sous_famille: Uuid, id_famille: Uuid) {
    this.base_exercice.SupprSousFamille(id_sous_famille).subscribe((res) => {
      console.log(res);
      this.maj_liste_sous_famille(id_famille);
    });
  }

  maj_liste_sous_famille(id_famille: Uuid) {
    this.base_exercice.GetSousFamilles(id_famille).subscribe(
      (response) => {
        this.enreg_sous_famille = response;
      },
      () => {
        alert('An error occured during retrieving data.');
      }
    );
    this.id_sf = '';
    this.lib_btn_valider_sf = 'Ajouter';
    this.groupe_sous_famille.patchValue({ sous_famille: '' });
  }

  sousFamille_selected(id_sousfamille: Uuid) {
    this.id_sf_selected = id_sousfamille;
  }

  // ------------------------------Niveau-----------------------------------

  keyup_niveau(event) {
    if (this.lib_btn_niveau == 'Valider modification' && event == '') {
      this.lib_btn_niveau = 'Ajouter';
      this.id_niveau = '';
    } else if (event != '') {
      this.lib_niveau = event;
    }
  }

  ajout_modif_niveau() {
    if (this.lib_niveau == '' || this.lib_niveau == undefined) {
      alert('Niveau ne doit pas être vide');
    } else {
      if (this.id_niveau == undefined || this.id_niveau == '') {
        this.base_exercice
          .getNiveauExercice(this.lib_niveau)
          .subscribe((res) => {
            if (res.length == 0) {
              this.base_exercice
                .AjoutNiveau(this.groupe_niveau.value)
                .subscribe(
                  () => {
                    this.ngOnInit();
                  },
                  () => {
                    alert('Error');
                  }
                );
            } else if (res.length > 0) {
              alert('Niveau déjà existant');
            }
          });
      } else {
        this.base_exercice
          .getNiveauExerciceId(this.lib_niveau, this.id_niveau)
          .subscribe((res) => {
            if (res.length == 0) {
              this.base_exercice
                .modifNiveauExercice(this.id_niveau, this.groupe_niveau.value)
                .subscribe(
                  () => {
                    this.ngOnInit();
                  },
                  () => {
                    alert('Error');
                  }
                );
            } else {
              alert('Niveau déjà existant');
            }
          });
      }
    }
  }

  afficher_pour_modif_niveau(niveau: '', id_niveau: Uuid) {
    this.groupe_niveau.patchValue({ niveau: niveau });
    this.id_niveau = id_niveau;
    this.lib_niveau = niveau;
    this.lib_btn_niveau = 'Valider modification';
  }

  supprimerNiveau(id_niveau: Uuid) {
    this.base_exercice.supprNiveau(id_niveau).subscribe(
      () => {
        this.ngOnInit();
      },
      () => {
        alert('Error');
      }
    );
  }

  is(id_niveau) {
    if (this.NiveauChecked.indexOf(id_niveau) == -1) {
      return false;
    }
    return true;
  }

  niveauSelected(id_niveau: Uuid) {
    let index = this.NiveauChecked.indexOf(id_niveau);

    if (index == -1) {
      this.NiveauChecked.push(id_niveau);
    } else {
      this.NiveauChecked.splice(index, 1);
    }
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

  // -------------------------------------MatriceExercice-----------------------
  MatriceExerciceSelected(id_matrice_exercice) {
    this.listeParamEntree.splice(0, this.listeParamEntree.length);
    this.id_matrice_selected = id_matrice_exercice;
    this.matriceExercice
      .Get_matrice(this.id_matrice_selected)
      .subscribe((res) => {
        this.listeParamEntree = res.ParametresEntree;
      });
  }

  // -------------------------------BASE EXERCICE------------------------------

  keyup_exercice(event) {
    this.lib_exercice = event;
  }

  enregExerciceData() {
    if (this.lib_exercice == '' || this.lib_exercice == undefined) {
      alert('Exercice ne doit pas être vide');
    } else {
      let enreg = this.fiche_exercice.value;
      enreg.famille = this.id_famille_selected;
      enreg.sousfamille = this.id_sf_selected;
      enreg.id_matrice_exercice = this.id_matrice_selected;

      if (this.id == '' || this.id == undefined) {
        // Ajout Base Exercice
        this.base_exercice
          .findBaseExercice(this.lib_exercice)
          .subscribe((response) => {
            if (response == '') {
              this.base_exercice.enregExerciceData(enreg).subscribe(
                (response) => {
                  // Enreg niveau
                  let enreg_base_niveau_exercice: any = {};
                  this.NiveauChecked.forEach((element) => {
                    enreg_base_niveau_exercice.id_niveau_exercice = element;
                    enreg_base_niveau_exercice.id_base_exercice = response.id;
                    this.base_exercice
                      .createBaseNiveauExercice(enreg_base_niveau_exercice)
                      .subscribe(
                        () => {},
                        () => {
                          alert(
                            'Erreur lors de la création de BaseNiveauExercice'
                          );
                        }
                      );
                  });

                  // Tag
                  let enreg_tag_base_exercice: any = {};
                  this.list_tag.forEach((element) => {
                    enreg_tag_base_exercice.id_base_exercice = response.id;
                    enreg_tag_base_exercice.id_tag = element.id;
                    this.base_exercice
                      .createTagBaseExercice(enreg_tag_base_exercice)
                      .subscribe(
                        () => {},
                        () => {
                          alert('Erreur : création TagBaseExercice');
                        }
                      );
                  });

                  // Exercice Data
                  let enreg: any = {};
                  this.list_data.forEach((element) => {
                    enreg.id_base_exercice = response.id;
                    enreg.id_exercice_data = element.idExerciceData;
                    this.base_exercice
                      .createBaseExerciceData(enreg)
                      .subscribe((response) => {
                        console.log(response);
                      });
                  });
                  this.router.navigate(['/liste_base_exercices']);
                },
                () => {
                  alert('Erreur lors de la création de BaseExercice');
                }
              );
            } else {
              alert('Titre Exercice déjà existant');
            }
          });
      } else {
        // Modif Base Exercice
        this.base_exercice
          .findBaseExerciceId(this.id, this.lib_exercice)
          .subscribe((response) => {
            if (response == '') {
              this.base_exercice.updateBaseExercice(this.id, enreg).subscribe(
                (response) => {
                  // Niveau
                  this.base_exercice
                    .deleteBaseNiveauExercice(this.id)
                    .subscribe((res) => {
                      let enreg_base_niveau_exercice: any = {};
                      this.NiveauChecked.forEach((element) => {
                        enreg_base_niveau_exercice.id_niveau_exercice = element;
                        enreg_base_niveau_exercice.id_base_exercice = this.id;
                        this.base_exercice
                          .createBaseNiveauExercice(enreg_base_niveau_exercice)
                          .subscribe(
                            () => {},
                            () => {
                              alert('Erreur : création BaseNiveauExercice');
                            }
                          );
                      });
                    });

                  // Tag
                  this.base_exercice
                    .deleteTagBaseExercice(this.id)
                    .subscribe((res) => {
                      let enreg_tag_base_exercice: any = {};
                      this.list_tag.forEach((element) => {
                        enreg_tag_base_exercice.id_base_exercice = this.id;
                        enreg_tag_base_exercice.id_tag = element.id;
                        this.base_exercice
                          .createTagBaseExercice(enreg_tag_base_exercice)
                          .subscribe(
                            () => {},
                            () => {
                              alert('Erreur : création TagBaseExercice');
                            }
                          );
                      });
                    });

                  // Data Exercice
                  this.base_exercice
                    .deleteBaseExerciceData(this.id)
                    .subscribe(() => {
                      let enreg: any = {};
                      this.list_data.forEach((element) => {
                        enreg.id_base_exercice = this.id;
                        enreg.id_exercice_data = element.idExerciceData;
                        this.base_exercice
                          .createBaseExerciceData(enreg)
                          .subscribe((response) => {
                            console.log(response);
                          });
                      });
                    });
                  this.router.navigate(['/liste_base_exercices']);
                },
                () => {
                  alert('Erreur lors de la modification');
                }
              );
            } else {
              alert('Titre Exercice déjà existant');
            }
          });
      }
    }
  }

  open_popup_data() {
    this.modalRef = this.modalService.open(PopupDataExerciceComponent, {
      size: 'xl',
    });

    this.modalRef.componentInstance.list_data = this.list_data;
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

  click_tr(exercice) {
    this.data_selected = exercice;
  }

  moveDataExercice(move = '') {
    let indexElement = -1;
    let index = -1;
    let data_to_move = [];
    let data_moved = false;

    if (this.data_selected != '') {
      this.list_data.forEach((element) => {
        index++;
        if (element.idExerciceData == this.data_selected) {
          indexElement = index;
          data_to_move.push({
            num_ordre: element.num_ordre,
            texte: element.texte,
            idExerciceData: element.idExerciceData,
            idBaseExercice: element.idBaseExercice,
          });
        }
      });

      if (move == 'up') {
        indexElement--;
        if (indexElement > -1 && data_to_move.length == 1) {
          this.list_data[indexElement + 1] = this.list_data[indexElement];
          this.list_data[indexElement] = data_to_move[0];
          data_moved = true;
        }
      } else if (move == 'down') {
        indexElement++;
        if (indexElement < this.list_data.length && data_to_move.length == 1) {
          this.list_data[indexElement - 1] = this.list_data[indexElement];
          this.list_data[indexElement] = data_to_move[0];
          data_moved = true;
        }
      }
    }
    if (data_moved == true) {
      this.data_selected = this.list_data[indexElement].idExerciceData;
    } else {
      this.data_selected = '';
    }
  }
}
