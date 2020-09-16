import { environment } from '../../environments/environment_aqiboost';
import { SyntheseVocaleService } from './synthese-vocale.service';
import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormControlName,
} from '@angular/forms';
import { AudioStream } from 'aws-sdk/clients/polly';

// import { synthese-vocale}

// AWS.config.loadFromPath('../../../../config.json')
AWS.config.accessKeyId = 'AKIAX3TVDQP7A5554RPE';
AWS.config.secretAccessKey = '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';
AWS.config.region = 'us-east-2';

@Component({
  selector: 'app-synthese-vocale',
  templateUrl: './synthese-vocale.component.html',
  styleUrls: ['./synthese-vocale.component.css'],
})
export class SyntheseVocaleComponent implements OnInit {
  public stream: AudioStream;
  TextToSynth: string;
  // audio: any;
  id: number;
  textSynthForm: FormGroup;
  selectedVoice = 'Lea';
  audio: boolean = false;
  isload: boolean = false;
  indication_synth: boolean = false;
  exercice_data: any = [];
  lib_text_synth: string = 'Texte à synthétiser';
  lib_ajout_modif: string = 'Ajouter dans la base';
  affich_btn_cancel: boolean = false;
  id_exercice: '';
  isValid: boolean;
  audioSrc = '';

  constructor(
    private synth_service: SyntheseVocaleService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.textSynthForm = this.fb.group({
      Text_synth: ['', [Validators.required]],
      audioSrc: '',
      audioSource: [''],
    });

    this.audioSrc = '';
    this.exercice_data.splice(0, this.exercice_data.length);
    this.synth_service.getExerciceData().subscribe(
      (response) => {
        let listExercice: any = [];
        listExercice = response;
        listExercice.forEach((element) => {
          if (element.TypeAudio) {
            this.exercice_data.push({
              id: element.id,
              DataTexte: element.DataTexte,
              DataMemo: element.DataMemo,
              NomFichier: element.NomFichier,
              TypeTexte: element.TypeTexte,
              TypeAudio: element.TypeAudio,
              TypeVideo: element.TypeVideo,
              DescriptifData: element.DescriptifData,
            });
          }
        });
        // this.exercice_data = response;
      },
      (error) => {
        console.log(error);
        alert('An error occured during retrieving data.');
      }
    );
  }

  get Text_synth() {
    return this.textSynthForm.get('Text_synth');
  }

  speakNow(input: string) {
    this.isload = true;
    this.audio = false;
    let data = {
      Text: input,
      VoiceId: this.selectedVoice,
    };

    this.synth_service.deleteall().subscribe((res) => {
      const texte = this.textSynthForm.value;
      this.synth_service.createSynth(texte).subscribe((result: any) => {
        if (result.UrlAudio != '') {
          this.indication_synth = true;
          this.isload = false;
          this.audio = true;
          this.isValid = true;

          this.audioSrc = `${result.UrlAudio}`;

          // this.LireSon(result.UrlAudio);
        }
      });
    });
  }

  speakNow_1() {
    this.synth_service.getTextToSynth().subscribe((res: any) => {
      this.id_exercice = '';
      if (res.length > 0) {
        let i = 0;
        for (i = 0; i < res.length; i++) {
          this.audioSrc = `${environment.apiUrl}/${res[i].UrlAudio}`;
          console.log(this.audioSrc);
        }
      }
    });
  }

  Ajout_Modif() {
    if (this.lib_ajout_modif == 'Ajouter dans la base') {
      this.AjouterExerciceData();
      // this.AjoutSansAudio()
    } else if (this.lib_ajout_modif == 'Valider la modification') {
      this.ModifierExerciceData();
    }
  }

  AjouterExerciceData() {
    this.synth_service.getTextToSynth().subscribe((res: any) => {
      this.id_exercice = '';
      if (res.length > 0) {
        let i = 0;
        let enreg: any = {};
        for (i = 0; i < res.length; i++) {
          enreg.DataTexte = res[i].Text_Synth;
          enreg.DataMemo = res[i].UrlAudio;
          enreg.TypeAudio = true;
          this.synth_service.addExerciceData(enreg).subscribe(
            (record) => {
              this.textSynthForm.patchValue({ Text_synth: '' });
              this.indication_synth = false;
              this.isValid = false;
              this.ngOnInit();
            },
            (error) => {
              alert('An error occured during adding data.');
            }
          );
        }
      }
    });
  }

  AjoutSansAudio() {
    let enreg: any = {};
    enreg.DataTexte = this.Text_synth.value;
    enreg.TypeAudio = true;
    this.synth_service.addExerciceData(enreg).subscribe(
      (record) => {
        this.textSynthForm.patchValue({ Text_synth: '' });
        this.indication_synth = false;
        this.ngOnInit();
      },
      (error) => {
        alert('An error occured during adding data.');
      }
    );
  }

  ModifierExerciceData() {
    if (this.id_exercice != '') {
      this.synth_service.getTextToSynth().subscribe((res: any) => {
        if (res.length > 0) {
          let enreg: any = {};
          let i = 0;
          for (i = 0; i < res.length; i++) {
            enreg.DataTexte = res[i].Text_Synth;
            enreg.DataMemo = res[i].UrlAudio;
            enreg.TypeAudio = true;
            this.synth_service
              .updateExerciceData(enreg, this.id_exercice)
              .subscribe(
                (record) => {
                  this.textSynthForm.patchValue({ Text_synth: '' });
                  this.indication_synth = false;
                  this.isValid = false;
                  this.ngOnInit();
                  this.InitTextSynthese();
                },
                (error) => {
                  alert('An error occured during updating data.');
                }
              );
          }
        }
      });
    }
  }

  LireSon(url_audio: Text) {
    let audio = new Audio();
    audio.src = `${environment.apiUrl}/${url_audio}`;
    audio.load();
    audio.play();
  }

  AfficherPourModif(texte_synth: Text, id: '') {
    this.lib_text_synth += ' [Modification]';
    this.lib_ajout_modif = 'Valider la modification';
    this.affich_btn_cancel = true;
    this.id_exercice = id;
    this.isValid = false;
    this.indication_synth = false;
    this.textSynthForm.patchValue({ Text_synth: texte_synth });
  }

  InitTextSynthese() {
    this.lib_text_synth = 'Texte à synthétiser';
    this.textSynthForm.patchValue({ Text_synth: '' });
    this.lib_ajout_modif = 'Ajouter dans la base';
    this.id_exercice = '';
    this.affich_btn_cancel = false;
    this.audioSrc = '';
    this.indication_synth = false;
  }

  SupprimerDataExercice(id: '') {
    this.synth_service.deleteExerciceData(id).subscribe(
      (record) => {
        this.ngOnInit();
      },
      (error) => {
        alert('An error occured during updating data.');
      }
    );
  }

  isValidForm() {
    return this.isValid;
  }

  //-------------------------------------------------------------------------------------------------------------------

  generersynth() {
    const polly = new AWS.Polly();
    const speechParams = {
      OutputFormat: 'mp3',
      SampleRate: '16000',
      Text: '<speak>' + this.TextToSynth + '</speak>',
      TextType: 'ssml',
      VoiceId: 'Lea',
    };

    polly.synthesizeSpeech(speechParams, (err, data) => {
      //debugger;
      if (err) {
        console.log(err, err.stack); // an error occurred
        // alert(err, err.stack)
      } else {
        // const uInt8Array = new Uint8Array(data.AudioStream);
        // const arrayBuffer = uInt8Array.buffer;
        // const blob = new Blob([arrayBuffer]);

        console.log(data);
        this.stream = data;
      }
    });
  }

  generersynth1() {
    this.synth_service.deleteall().subscribe((res) => {
      const payload = this.textSynthForm.value;
      this.synth_service.createSynth(payload).subscribe(
        (response) => {
          // const url = window.URL.createObjectURL(response.VocalData);
          // console.log(url)
          // maybe the solution
          // audiosource.srcObject = response.VocalData

          // navigator.mediaDevices.getUserMedia({ audio: true })
          //   .then(response => {
          //     console.log('> stream', response);
          //     this.stream = response
          //   })
          //   .catch(err => {
          //     console.log('> Error', err);
          //   })

          // const uInt8Array = new Uint8Array(response.VocalData);
          // const arrayBuffer = uInt8Array.buffer;
          // const blob = new Blob([arrayBuffer]);

          console.log(response.VocalData);
          this.stream = response.VocalData;
        },
        (error) => {
          alert('Error');
        }
      );
    });
  }
}
