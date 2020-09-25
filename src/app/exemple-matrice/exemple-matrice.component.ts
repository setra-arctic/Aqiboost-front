import { ToastrService } from 'ngx-toastr';
import { InscriptionParentsService } from './../inscription-parents/inscription-parents.service';
import { AppComponent } from './../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PopupDataExerciceService } from './../liste-exercices/fiche-exercice/popup-data-exercice/popup-data-exercice.service';
import { ExempleMatriceService } from './exemple-matrice.service';
import { ListeExercicesService } from './../liste-exercices/liste-exercices.service';
import { Inject, Component, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Uuid } from 'aws-sdk/clients/groundstation';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

@Component({
  selector: 'app-exemple-matrice',
  templateUrl: './exemple-matrice.component.html',
  styleUrls: ['./exemple-matrice.component.css'],
})
export class ExempleMatriceComponent implements OnInit {
  base_exercice: any = [];
  audio_base_exercice: any = [];
  exercice_data = [];
  base_exercice_data: any = [];
  FormExempleMatrice: FormGroup;
  idBaseExercice: Uuid;
  idExerciceData: Uuid;
  toggle: Boolean;
  shift: Boolean;
  listKey: any = [];
  tempListKey: any = [];
  audioOK = false;
  url_fichier = '';
  texteDictee = '';
  listCaract: any = [];
  listCaractSaisie: any = [];
  texteSaisie = '';
  keyboardOff = true;
  lockImage = 'Cadena verouillé.png';
  nbFautes = 0;
  btnVisible = false;
  indiceCaractValide = -1;
  toucheDetectable = false;
  numPage = 0;
  idEnfant: Uuid;
  txtBienvenue: String;
  clickSouris = false;
  finExercice = false;
  totalNbFautes = 0;
  resumeExercice = '';
  cadenaVisible = false;

  constructor(
    private form_builder: FormBuilder,
    private BaseExercice: ListeExercicesService,
    private ExerciceData: ExempleMatriceService,
    private dataAudio: PopupDataExerciceService,
    private route: ActivatedRoute,
    private appComponent: AppComponent,
    private serviceEnfant: InscriptionParentsService,
    private Toast: ToastrService,
    private router: Router
  ) {
    this.appComponent.menuVisible = false;
    this.idEnfant = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.FormExempleMatrice = this.form_builder.group({
      saisie: ['', []],
    });

    this.ExerciceData.listerExercicesEnfant(this.idEnfant).subscribe(
      (response) => {
        this.base_exercice = response;
      },
      (error) => {
        alert('An error occured during retrieving data.');
      }
    );

    this.serviceEnfant.getEnfant(this.idEnfant).subscribe((res) => {
      if (res.length > 0) {
        this.txtBienvenue = 'Bienvenue ' + res[0].Prenom;
      }
    });

    for (let i = 0; i < 50; i++) {
      this.listKey.push({
        key: '',
        shiftKey: false,
        greenStatus: false,
        redStatus: false,
        disabled: true,
      });
    }

    this.ExerciceData.getKey().subscribe((res) => {
      // console.log(res);
      this.listKey = res;
      if (!this.listKey) {
      } else {
        this.listKey.forEach((element) => {
          element.disabled = true;
        });
      }
    });
  }

  click_tr(id_selected) {
    this.idBaseExercice = id_selected;
    this.exercice_data.splice(0, this.exercice_data.length);
  }

  selectExerciceData(idExerciceData) {
    let txt = '';
    let i = 0;
    this.audioOK = false;
    let otherCaract = '';
    this.dataAudio.getExerciceData(idExerciceData).subscribe((res) => {
      if (!res) {
      } else {
        console.log(res);
        this.audioOK = true;
        this.url_fichier = res.DataMemo;
        this.texteDictee = res.DataTexte;
        for (i = 0; i <= this.texteDictee.length; i++) {
          txt = this.texteDictee.slice(i, i + 1);
          otherCaract = txt;
          if (txt == '’') {
            otherCaract = "'";
          }
          this.listCaract.push({
            caract: txt,
            otherCaract: otherCaract,
          });
        }
      }
    });
  }

  listerExercice() {
    this.numPage = 1;
  }

  goToExercice(idBaseExercice) {
    this.ExerciceData.getBaseExerciceData(idBaseExercice).subscribe(
      (response) => {
        this.base_exercice_data = response;
        this.base_exercice_data.forEach((element) => {
          // console.log(element.idExerciceData)
          this.ExerciceData.getAudioExerciceData(
            element.idExerciceData
          ).subscribe((res) => {
            if (res.length > 0) {
              this.selectExerciceData(res[0].id);
              this.numPage = 2;
            } else {
              this.Toast.info('Exercice non disponible', '', {
                timeOut: 3000,
                positionClass: 'toast-top-center',
              });
            }
          });
        });
      },
      (error) => {
        alert('An error occured during retrieving data.');
        console.log(error);
      }
    );
  }

  Deconnexion() {
    this.idEnfant = '';
    this.router.navigate(['enfant']);
  }

  // --------------------------------keyBoard-----------------------------
  keyPress(keyPressed, click) {
    let i = 0;
    this.indiceCaractValide = -1;
    let indiceTouche = -1;
    this.toucheDetectable = false;

    if (click) {
      this.listKey.forEach((element) => {
        if (element.state == true) {
          element.greenStatus = false;
          element.redStatus = false;
        }
        if (element.key == keyPressed) {
          if (element.state == true) {
            this.toucheDetectable = true;
          }
        }
      });

      if (!this.keyboardOff) {
        if (keyPressed == 'Shift') {
          // Afficher les caractères correspondants lorsque Shift est maintenu
          switch (this.listKey[0].greenStatus) {
            case true:
              this.listKey[0].greenStatus = false;
              if (this.tempListKey.length > 0) {
                for (i = 0; i <= 48; i++) {
                  this.listKey[i].key = this.tempListKey[i].key;
                }
              }
              break;
            case false:
              this.listKey[0].greenStatus = true;
              this.shiftUp();
          }
        } else {
          if (this.tempListKey.length > 0) {
            for (i = 0; i <= 48; i++) {
              this.listKey[i].key = this.tempListKey[i].key;
            }
            this.listKey[0].greenStatus = false;
          }
        }
        // Détecter la touche cliquée et tester si valide
        if (this.toucheDetectable) {
          i = -1;
          this.listKey.forEach((element) => {
            i++;
            if (element.key == keyPressed) {
              if (
                keyPressed ==
                  this.listCaract[this.listCaractSaisie.length].caract ||
                keyPressed ==
                  this.listCaract[this.listCaractSaisie.length].otherCaract
              ) {
                this.indiceCaractValide = i;
              } else {
                if ((element.state = true)) {
                  element.redStatus = true;
                  this.nbFautes++;
                  this.totalNbFautes++;
                }
              }
            }
          });
          if (this.indiceCaractValide > -1) {
            this.nbFautes = 0;
            i = this.indiceCaractValide;
            if (this.indiceCaractValide > 49) {
              i = this.indiceCaractValide - 49;
            }
            this.listKey[i].greenStatus = true;
            this.listCaractSaisie.push(
              this.listKey[this.indiceCaractValide].key
            );
            this.texteSaisie += this.listKey[this.indiceCaractValide].key;
            this.FormExempleMatrice.patchValue({
              saisie: this.texteSaisie,
            });
            if (this.listCaractSaisie.length == this.listCaract.length - 1) {
              this.statExercice();
            }
          }
          if (this.nbFautes > 0) {
            this.lockKeyboard();
          } else {
            if (this.indiceCaractValide > -1) {
              i = this.indiceCaractValide;
              if (this.indiceCaractValide > 49) {
                i = this.indiceCaractValide - 49;
              }
              if (this.listKey[this.indiceCaractValide].state == true) {
                this.listKey[i].greenStatus = false;
              }
            }
          }
        }
      }
    } else {
      if (!this.keyboardOff) {
        if (keyPressed.key == 'Shift') {
          this.shiftUp();
        }
        this.toucheDetectable = false;

        i = -1;
        this.listKey.forEach((element) => {
          i++;
          if (element.state == true && element.key == keyPressed.key) {
            indiceTouche = i;
            this.toucheDetectable = true;
          }
        });

        // Détecter la touche enfoncée et tester si valide
        i = -1;
        let j = -1;
        this.listKey.forEach((element) => {
          i++;
          if (element.key == keyPressed.key && element.state == true) {
            if (
              keyPressed.key ==
                this.listCaract[this.listCaractSaisie.length].caract ||
              keyPressed.key ==
                this.listCaract[this.listCaractSaisie.length].otherCaract
            ) {
              this.indiceCaractValide = i;
            } else {
              if (element.state == true && i == indiceTouche) {
                j = i;
                if (j > 49) {
                  j -= 49;
                }
                this.listKey[j].redStatus = true;
                this.totalNbFautes++;
                this.nbFautes++;
              }
            }
          }
        });

        if (this.indiceCaractValide > -1) {
          this.nbFautes = 0;
          i = this.indiceCaractValide;
          if (this.indiceCaractValide > 49) {
            i = this.indiceCaractValide - 49;
          }
          this.listKey[i].greenStatus = true;
          this.listCaractSaisie.push(this.listKey[this.indiceCaractValide].key);
          this.texteSaisie += this.listKey[this.indiceCaractValide].key;
          this.FormExempleMatrice.patchValue({
            saisie: this.texteSaisie,
          });

          if (this.listCaractSaisie.length == this.listCaract.length - 1) {
            this.listKey[i].greenStatus = false;
            this.statExercice();
          }
        }
      }
    }
  }

  keyDown(keyPressed) {
    let i = 0;

    if (!keyPressed.key) {
    } else {
      if (!this.keyboardOff) {
        if (keyPressed.key == 'Shift' && this.nbFautes == 0) {
          if (this.tempListKey.length > 0) {
            for (i = 0; i <= 48; i++) {
              this.listKey[i].key = this.tempListKey[i].key;
            }
          }
        }

        if (this.nbFautes > 0 && this.toucheDetectable) {
          this.lockKeyboard();
        } else {
          if (this.indiceCaractValide > -1) {
            i = this.indiceCaractValide;
            if (this.indiceCaractValide > 49) {
              i = this.indiceCaractValide - 49;
            }
            if (this.listKey[this.indiceCaractValide].state == true) {
              this.listKey[i].greenStatus = false;
            }
          }
        }
      }
    }
  }

  shiftUp() {
    let keyExist = false;
    let i = 0;
    // Afficher les caractères correspondants lorsque Shift est maintenu
    for (i = 0; i <= 48; i++) {
      keyExist = false;
      this.tempListKey.forEach((element) => {
        if (element.key == this.listKey[i].key) {
          keyExist = true;
        }
      });

      if (!keyExist) {
        this.tempListKey.push({
          key: this.listKey[i].key,
          shiftKey: false,
          greenStatus: false,
          redStatus: false,
          disabled: false,
        });
      }
      if (i > 0) {
        this.listKey[i].key = this.listKey[i + 49].key;
      }
    }
  }

  lockKeyboard() {
    let keyExist = false;
    let i = -1;
    this.keyboardOff = true;
    let toucheDetectable = false;

    this.listKey.forEach((element) => {
      i++;
      if (
        element.key == this.listCaract[this.listCaractSaisie.length].caract ||
        element.key == this.listCaract[this.listCaractSaisie.length].otherCaract
      ) {
        this.indiceCaractValide = i;
      }
    });

    this.keyboardStatus(false);
    if (this.nbFautes == 2) {
      if (this.indiceCaractValide > -1) {
        if (this.listKey[this.indiceCaractValide].shiftKey == true) {
          for (i = 0; i <= 48; i++) {
            keyExist = false;
            this.tempListKey.forEach((element) => {
              if (element.key == this.listKey[i].key) {
                keyExist = true;
              }
            });

            if (!keyExist) {
              this.tempListKey.push({
                key: this.listKey[i].key,
                shiftKey: false,
                greenStatus: false,
                redStatus: false,
                disabled: false,
              });
            }

            if (i > 0) {
              this.listKey[i].key = this.listKey[i + 49].key;
            }
          }
          this.indiceCaractValide -= 49;
        }

        this.listKey.forEach((element) => {
          element.redStatus = false;
        });
        this.listKey[this.indiceCaractValide].greenStatus = true;
        this.nbFautes = 0;
      }
    }
  }

  keyboardStatus(status) {
    let i = 0;
    switch (status) {
      case true:
        this.lockImage = 'Cadena déverouillé.png';
        this.keyboardOff = false;
        this.audioOK = false;
        if (this.tempListKey.length > 0) {
          for (i = 0; i <= 48; i++) {
            this.listKey[i].key = this.tempListKey[i].key;
          }
        }
        break;
      case false:
        this.lockImage = 'Cadena verouillé.png';
        this.keyboardOff = true;
        break;
    }
    this.listKey.forEach((element) => {
      element.disabled = this.keyboardOff;
      if (!this.keyboardOff) {
        element.redStatus = false;
        element.greenStatus = false;
      }
    });
  }

  debutExercice() {
    this.keyboardStatus(true);
    this.cadenaVisible = true;
    this.finExercice = false;
    this.totalNbFautes = 0;
    this.nbFautes = 0;
  }

  statExercice() {
    this.resumeExercice = 'Nombre de fautes : ' + this.totalNbFautes;
    this.keyboardStatus(false);
    this.cadenaVisible = false;
    this.finExercice = true;
  }

  enregKey() {
    if (this.listKey.length > 0) {
      this.ExerciceData.enregKey(this.listKey).subscribe((res) => {
        console.log(res);
      });
    }
  }
}
