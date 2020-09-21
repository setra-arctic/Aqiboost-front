import { PopupDataExerciceService } from './../liste-exercices/fiche-exercice/popup-data-exercice/popup-data-exercice.service';
import { ExempleMatriceService } from './exemple-matrice.service';
import { ListeExercicesService } from './../liste-exercices/liste-exercices.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Uuid } from 'aws-sdk/clients/groundstation';

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

  constructor(
    private form_builder: FormBuilder,
    private BaseExercice: ListeExercicesService,
    private ExerciceData: ExempleMatriceService,
    private dataAudio: PopupDataExerciceService,
    private renderer: Renderer2
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

    this.listKey.push({
      key: '',
      shiftKey: false,
      greenStatus: false,
      redStatus: false,
      disabled: true,
    });

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
  keyPress(keyPressed) {
    let i = 0;
    let keyExist = false;
    let indiceCaractValide = -1;

    if (keyPressed.key == 'Shift') {
      for (i = 2; i <= 48; i++) {
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

        this.listKey[i].key = this.listKey[i + 48].key;
      }
    }

    // Chercher l'indice du caractère valide
    i = -1;
    this.listKey.forEach((element) => {
      i++;
      if (
        element.key == this.listCaract[this.listCaractSaisie.length].caract ||
        element.key == this.listCaract[this.listCaractSaisie.length].otherCaract
      ) {
        indiceCaractValide = i;
      }
    });

    this.listKey.forEach((element) => {
      if (element.key == keyPressed.key) {
        // console.log(
        //   keyPressed.key,
        //   this.listCaract[this.listCaractSaisie.length]
        // );
        if (
          keyPressed.key ==
            this.listCaract[this.listCaractSaisie.length].caract ||
          keyPressed.key ==
            this.listCaract[this.listCaractSaisie.length].otherCaract
        ) {
          element.greenStatus = true;
          this.listCaractSaisie.push(keyPressed.key);
          this.texteSaisie += keyPressed.key;
          this.FormExempleMatrice.patchValue({
            saisie: this.texteSaisie,
          });
        } else {
          element.redStatus = true;
          if (element.key != 'Shift') {
            this.nbFautes++;
          }
        }
      }
    });

    if (this.nbFautes == 2) {
      this.keyboardStatus(false);
      if (indiceCaractValide > -1) {
        if (this.listKey[indiceCaractValide].shiftKey == true) {
          for (i = 2; i <= 48; i++) {
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

            this.listKey[i].key = this.listKey[i + 48].key;
          }
        }
        this.listKey[indiceCaractValide].greenStatus = true;
      }
    }

    if (keyPressed.key == 'Dead') {
      this.listKey[24].redStatus = true;
    }
    // if (!keyExist) {
    //   this.listKey.push({
    //     key: keyPressed.key,
    //     shiftKey: keyPressed.shiftKey,
    //     greenStatus: false,
    //     redStatus: false,
    //     disabled: false,
    //   });
    // }
  }

  keyDown(keyPressed) {
    let i = 0;
    if (keyPressed.key == 'Shift') {
      if (this.tempListKey.length > 0) {
        for (i = 2; i <= 48; i++) {
          this.listKey[i].key = this.tempListKey[i - 2].key;
        }
      }
    }

    this.listKey.forEach((element) => {
      if (element.key == keyPressed.key && this.nbFautes < 2) {
        element.greenStatus = false;
        element.redStatus = false;
      }
    });

    if (keyPressed.key == 'Dead') {
      this.listKey[24].redStatus = false;
    }
  }

  enregKey() {
    console.log(this.listKey);
    if (this.listKey.length > 0) {
      this.ExerciceData.enregKey(this.listKey).subscribe((res) => {
        console.log(res);
      });
    }
  }

  keyboardStatus(status) {
    switch (status) {
      case true:
        this.lockImage = 'Cadena déverouillé.png';
        this.keyboardOff = false;
        this.nbFautes = 0;
        break;
      case false:
        this.lockImage = 'Cadena verouillé.png';
        this.keyboardOff = true;
        break;
    }
    this.listKey.forEach((element) => {
      element.disabled = this.keyboardOff;
      element.redStatus = false;
      element.greenStatus = false;
    });
  }
}
