import { ExempleMatriceService } from './exemple-matrice.service';
import { ListeExercicesService } from './../liste-exercices/liste-exercices.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Uuid } from 'aws-sdk/clients/groundstation';

@Component({
  selector: 'app-exemple-matrice',
  templateUrl: './exemple-matrice.component.html',
  styleUrls: ['./exemple-matrice.component.css']
})
export class ExempleMatriceComponent implements OnInit {

  base_exercice: any = []
  audio_base_exercice: any = []
  exercice_data = []
  base_exercice_data: any = []
  FormExempleMatrice: FormGroup
  idBaseExercice: Uuid

  constructor(
    private form_builder: FormBuilder,
    private BaseExercice: ListeExercicesService,
    private ExerciceData: ExempleMatriceService
  ) { }

  ngOnInit(): void {

    this.FormExempleMatrice = this.form_builder.group({})

    this.BaseExercice.getBaseExercices()
      .subscribe(
        response => {
          // console.log(response)
          this.base_exercice = response
        },
        error => {
          alert('An error occured during retrieving data.')
        }
      )
  }

  click_tr(id_selected) {
    this.idBaseExercice = id_selected
    this.exercice_data.splice(0, this.exercice_data.length)
    if (this.idBaseExercice != '') {
      this.ExerciceData.getBaseExerciceData(this.idBaseExercice)
        .subscribe(
          response => {
            this.base_exercice_data = response
            this.base_exercice_data.forEach(element => {
              // console.log(element.idExerciceData)
              this.ExerciceData.getAudioExerciceData(element.idExerciceData)
                .subscribe(
                  res => {
                    if (res.length > 0) {
                      res.forEach(element => {
                        this.exercice_data.push({
                          id: element.id,
                          DataTexte: element.DataTexte,
                          DescriptifData: element.DescriptifData
                        })
                      });
                    }
                  }
                )
            });
          },
          error => {
            alert('An error occured during retrieving data.')
            console.log(error)
          }
        )
    }
  }
}
