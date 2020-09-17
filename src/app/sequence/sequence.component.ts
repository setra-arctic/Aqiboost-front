import { Uuid } from 'aws-sdk/clients/groundstation';
import { SequenceService } from './sequence.service';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { sequence } from '@angular/animations';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css'],
})
export class SequenceComponent implements OnInit {
  listeSequence: any = [];
  formSequence: FormGroup;
  closeResult = '';
  sequenceMode = 'Ajouter';
  invalidSequence = false;
  sequenceId: Uuid;

  constructor(
    private sequence: SequenceService,
    private modalService: NgbModal,
    private Toast: ToastrService,
    private form_builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.sequence.getSequences().subscribe((res) => {
      this.listeSequence = res;
    });
    this.formSequence = this.form_builder.group({
      numero: [],
      sequence: [],
    });
  }

  open(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'sl' })
      .result.then(
        (result) => {
          if (result == 'sequence') {
            switch (this.sequenceMode) {
              case 'Ajouter':
                this.sequence
                  .addSequence(this.formSequence.value)
                  .subscribe(() => {
                    this.ngOnInit();
                  });
                break;
              case 'Modifier':
                this.sequence
                  .updateSequence(this.sequenceId, this.formSequence.value)
                  .subscribe(() => {
                    this.ngOnInit();
                  });
                break;
            }
          }
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

  modifieSequenceMode(mode, id) {
    this.sequenceMode = mode;
    let numSequence = 0;
    if (mode == 'Ajouter') {
      this.listeSequence.forEach((element) => {
        if (element.numero > numSequence) {
          numSequence = element.numero;
        }
      });
      numSequence++;
      this.formSequence.patchValue({
        numero: numSequence,
        sequence: '',
      });
      this.invalidSequence = true;
    } else if (mode == 'Modifier') {
      this.sequence.getASequence(id).subscribe((res) => {
        let resSequence: any = {};
        resSequence = res;
        this.formSequence.patchValue({
          numero: resSequence[0].numero,
          sequence: resSequence[0].sequence,
        });
      });
      this.sequenceId = id;
    }
  }

  keyupSequence(sequence) {
    switch (this.sequenceMode) {
      case 'Ajouter':
        this.invalidSequence = false;
        this.listeSequence.forEach((element) => {
          if (sequence == element.sequence) {
            this.invalidSequence = true;
          }
        });
        if (!sequence) {
          this.invalidSequence = true;
        }
        break;
      case 'Modifier':
        this.invalidSequence = false;
        this.listeSequence.forEach((element) => {
          if (sequence == element.sequence && element.id != this.sequenceId) {
            this.invalidSequence = true;
          }
        });
        if (!sequence) {
          this.invalidSequence = true;
        }
        break;
    }
  }

  supprSequence(id) {
    let i = 0;
    this.sequence.deleteSequence(id).subscribe(() => {
      let j = -1;
      let indiceList = j;
      this.listeSequence.forEach((element) => {
        j++;
        if (element.id == id) {
          indiceList = j;
        }
      });
      this.listeSequence.splice(indiceList, 1);
      this.sequence.getSequences().subscribe((res) => {
        let resSequence: any = {};
        resSequence = res;
        resSequence.forEach((element) => {
          i++;
          let enreg: any = {};
          enreg.numero = i;
          enreg.sequence = element.sequence;
          this.sequence.updateSequence(element.id, enreg).subscribe();
          this.listeSequence[i - 1].numero = i;
        });
      });
    });
  }
}
