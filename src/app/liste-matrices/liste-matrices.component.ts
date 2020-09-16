import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListeMatricesService } from './liste-matrices.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-liste-matrices',
  templateUrl: './liste-matrices.component.html',
  styleUrls: ['./liste-matrices.component.css'],
})
export class ListeMatricesComponent implements OnInit {
  FormListMatrice: FormGroup;
  matrice_exercice: any = [];
  liste_exercice: any = [];
  closeResult = '';
  @Input() Titre_matrice: string;
  nom_matrice = '';

  constructor(
    private matrice_service: ListeMatricesService,
    private modalService: NgbModal,
    private form_builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.FormListMatrice = this.form_builder.group({
      NumeroMatrice: ['', []],
      TitreMatrice: ['', []],
    });

    this.matrice_service.getAll().subscribe(
      (response) => {
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

  getExercices(idMatriceExercice, nomMatrice) {
    this.matrice_service.getExercices(idMatriceExercice).subscribe((res) => {
      this.liste_exercice = res;
    });
    this.nom_matrice = nomMatrice;
  }

  open(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'sl' })
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
}
