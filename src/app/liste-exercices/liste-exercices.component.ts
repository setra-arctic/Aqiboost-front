import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListeExercicesService } from './liste-exercices.service'

@Component({
  selector: 'app-liste-exercices',
  templateUrl: './liste-exercices.component.html',
  styleUrls: ['./liste-exercices.component.css']
})
export class ListeExercicesComponent implements OnInit {

  base_exercice: any = []
  FormListeBaseExercice: FormGroup

  constructor(
    private form_builder: FormBuilder,
    private BaseExercice: ListeExercicesService
  ) { }

  ngOnInit(): void {
    this.FormListeBaseExercice = this.form_builder.group({

    });

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

  delete_base_exercice(id_base_exercice) {
    this.BaseExercice.deleteBaseExercice(id_base_exercice)
      .subscribe(
        res => {
          this.ngOnInit()
        }
      )
  }
}
