import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListeMatricesService } from './liste-matrices.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

@Component({
  selector: 'app-liste-matrices',
  templateUrl: './liste-matrices.component.html',
  styleUrls: ['./liste-matrices.component.css'],
})
export class ListeMatricesComponent implements OnInit {
  FormListMatrice: FormGroup;
  matrice_exercice: any = [];
  @Input() Titre_matrice: string;

  constructor(
    private matrice_service: ListeMatricesService,
    private form_builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.FormListMatrice = this.form_builder.group({
      NumeroMatrice: ['', []],
      TitreMatrice: ['', []],
    });

    this.matrice_service.getAll().subscribe(
      (response) => {
        // console.log(response)
        this.matrice_exercice = response;
      },
      (error) => {
        alert('An error occured during retrieving data.');
      }
    );
  }

  suppr_matrice(id: '') {
    this.matrice_service.delete(id).subscribe(
      (record) => {
        this.ngOnInit();
      },
      (error) => {
        alert('An error occured during deleting data.');
      }
    );
  }
}
