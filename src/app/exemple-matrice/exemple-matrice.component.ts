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

  constructor(
    private form_builder: FormBuilder,
    private BaseExercice: ListeExercicesService,
    private ExerciceData: ExempleMatriceService,
    private dataAudio: PopupDataExerciceService,
    @Inject(ElementRef) private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.FormExempleMatrice = this.form_builder.group({
      saisie: ['', []],
    });

    this.BaseExercice.getBaseExercices().subscribe(
      (response) => {
        // console.log(response)
        this.base_exercice = response;
      },
      (error) => {
        alert('An error occured during retrieving data.');
      }
    );

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
    if (this.idBaseExercice != '') {
      this.ExerciceData.getBaseExerciceData(this.idBaseExercice).subscribe(
        (response) => {
          this.base_exercice_data = response;
          this.base_exercice_data.forEach((element) => {
            // console.log(element.idExerciceData)
            this.ExerciceData.getAudioExerciceData(
              element.idExerciceData
            ).subscribe((res) => {
              if (res.length > 0) {
                res.forEach((element) => {
                  this.exercice_data.push({
                    id: element.id,
                    DataTexte: element.DataTexte,
                    DescriptifData: element.DescriptifData,
                  });
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

  // --------------------------------keyBoard-----------------------------
  keyPress(keyPressed, click) {
    let i = 0;
    let keyExist = false;
    this.indiceCaractValide = -1;

    if (click) {
      // this.listKey.forEach((element) => {
      //   if (element.key != 'Shift') {
      //     element.greenStatus = false;
      //     element.redStatus = false;
      //   }
      // });
      // if (!this.keyboardOff) {
      //   if (keyPressed == 'Shift') {
      //     // Afficher les caractères correspondants lorsque Shift est maintenu
      //     console.log(this.listKey[0].greenStatus);
      //     switch (this.listKey[0].greenStatus) {
      //       case true:
      //         this.listKey[0].greenStatus = false;
      //         if (this.tempListKey.length > 0) {
      //           for (i = 2; i <= 48; i++) {
      //             this.listKey[i].key = this.tempListKey[i - 2].key;
      //           }
      //         }
      //         break;
      //       case false:
      //         this.listKey[0].greenStatus = true;
      //         for (i = 2; i <= 48; i++) {
      //           keyExist = false;
      //           this.tempListKey.forEach((element) => {
      //             if (element.key == this.listKey[i].key) {
      //               keyExist = true;
      //             }
      //           });
      //           if (!keyExist) {
      //             this.tempListKey.push({
      //               key: this.listKey[i].key,
      //               shiftKey: false,
      //               greenStatus: false,
      //               redStatus: false,
      //               disabled: false,
      //             });
      //           }
      //           this.listKey[i].key = this.listKey[i + 48].key;
      //         }
      //     }
      //   }
      //   // Détecter la touche enfoncée et tester si valide
      //   this.listKey.forEach((element) => {
      //     if (element.key == keyPressed) {
      //       if (
      //         keyPressed ==
      //           this.listCaract[this.listCaractSaisie.length].caract ||
      //         keyPressed ==
      //           this.listCaract[this.listCaractSaisie.length].otherCaract
      //       ) {
      //         this.nbFautes = 0;
      //         element.greenStatus = true;
      //         this.listCaractSaisie.push(keyPressed);
      //         this.texteSaisie += keyPressed;
      //         this.FormExempleMatrice.patchValue({
      //           saisie: this.texteSaisie,
      //         });
      //       } else {
      //         if (keyPressed != 'Shift') {
      //           element.redStatus = true;
      //           this.nbFautes++;
      //           if (this.nbFautes == 2) {
      //             this.lockKeyboard();
      //           }
      //           console.log(
      //             'element.key : ' + element.key,
      //             'keyPressed.key : ' + keyPressed,
      //             'this.listCaract[this.listCaractSaisie.length].caract : ' +
      //               this.listCaract[this.listCaractSaisie.length].caract,
      //             'this.nbFautes : ' + this.nbFautes
      //           );
      //         }
      //       }
      //     }
      //   });
      //   // La chaîne " ¨ " n'est pas renvoyée par (keydown)
      //   if (keyPressed == 'Dead') {
      //     this.listKey[24].redStatus = true;
      //   }
      // }
    } else {
      if (!this.keyboardOff) {
        if (keyPressed.key == 'Shift') {
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

        // Détecter la touche enfoncée et tester si valide
        i = -1;
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
              // this.nbFautes = 0;
              // element.greenStatus = true;
              // this.listCaractSaisie.push(keyPressed.key);
              // this.texteSaisie += keyPressed.key;
              // this.FormExempleMatrice.patchValue({
              //   saisie: this.texteSaisie,
              // });
            } else {
              if (element.state == true) {
                element.redStatus = true;
                this.nbFautes++;
              }
            }
          }
        });

        if (this.indiceCaractValide > -1) {
          this.nbFautes = 0;
          this.listKey[this.indiceCaractValide].greenStatus = true;
          this.listCaractSaisie.push(this.listKey[this.indiceCaractValide].key);
          this.texteSaisie += this.listKey[this.indiceCaractValide].key;
          this.FormExempleMatrice.patchValue({
            saisie: this.texteSaisie,
          });
        }
      }
    }
  }

  keyDown(keyPressed) {
    let i = 0;

    if (!keyPressed.key) {
    } else {
      if (!this.keyboardOff) {
        if (keyPressed.key == 'Shift') {
          if (this.tempListKey.length > 0) {
            for (i = 0; i <= 48; i++) {
              this.listKey[i].key = this.tempListKey[i].key;
            }
          }
        }

        if (this.nbFautes > 0) {
          this.lockKeyboard();
        } else {
          if (this.indiceCaractValide > -1) {
            if (this.listKey[this.indiceCaractValide].state == true) {
              this.listKey[this.indiceCaractValide].greenStatus = false;
            }
          }
        }

        // this.listKey.forEach((element) => {
        //   if (element.key == keyPressed.key && this.nbFautes == 0) {
        //     element.greenStatus = false;
        //     element.redStatus = false;
        //   }
        // });
      }
    }
  }

  lockKeyboard() {
    let keyExist = false;
    let i = -1;
    this.keyboardOff = true;

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
    if (this.tempListKey.length > 0) {
      for (i = 0; i <= 48; i++) {
        this.listKey[i].key = this.tempListKey[i].key;
      }
    }
  }

  enregKey() {
    if (this.listKey.length > 0) {
      this.ExerciceData.enregKey(this.listKey).subscribe((res) => {
        console.log(res);
      });
    }
  }
}
