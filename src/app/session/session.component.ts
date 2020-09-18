import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SessionService } from './session.service';
import { SequenceService } from './../sequence/sequence.service';
import { Uuid } from 'aws-sdk/clients/groundstation';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
})
export class SessionComponent implements OnInit {
  sequenceSelected: Uuid;
  listeSequence: any = [];
  listeSession: any = [];
  formSession: FormGroup;
  invalidSession = false;
  sessionMode = 'Ajouter';
  sessionId: Uuid;
  closeResult = '';
  selectedSequence = true;

  constructor(
    private sequence: SequenceService,
    private form_builder: FormBuilder,
    private modalService: NgbModal,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.formSession = this.form_builder.group({
      session: [],
    });
    if (this.listeSequence.length == 0) {
      this.sequence.getSequences().subscribe((res) => {
        this.listeSequence = res;
      });
    }
  }

  selectSequence(id) {
    this.sequenceSelected = id;
    if (!id) {
      this.selectedSequence = true;
    } else {
      this.selectedSequence = false;
      this.session
        .getSessionsBySequence(this.sequenceSelected)
        .subscribe((res) => {
          this.listeSession = res;
        });
    }
  }

  keyupSession(session) {
    switch (this.sessionMode) {
      case 'Ajouter':
        this.invalidSession = false;
        this.listeSession.forEach((element) => {
          if (
            session == element.session &&
            this.sequenceSelected == element.sequenceId
          ) {
            this.invalidSession = true;
          }
        });
        if (!session) {
          this.invalidSession = true;
        }
        break;
      case 'Modifier':
        this.invalidSession = false;
        this.listeSession.forEach((element) => {
          if (
            session == element.session &&
            element.id != this.sessionId &&
            this.sequenceSelected == element.sequenceId
          ) {
            this.invalidSession = true;
          }
        });
        if (!session) {
          this.invalidSession = true;
        }
        break;
    }
  }

  modifieSessionMode(mode, id) {
    this.sessionMode = mode;
    if (mode == 'Ajouter') {
      this.formSession.patchValue({
        sequence: '',
      });
      this.invalidSession = true;
    } else if (mode == 'Modifier') {
      this.session.getASession(id).subscribe((res) => {
        let resSession: any = {};
        resSession = res;
        this.formSession.patchValue({
          session: resSession[0].session,
        });
      });
      this.sessionId = id;
    }
  }

  open(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'sl' })
      .result.then(
        (result) => {
          if (result == 'session') {
            let enreg: any = {};
            enreg = this.formSession.value;
            enreg.sequenceId = this.sequenceSelected;
            switch (this.sessionMode) {
              case 'Ajouter':
                this.session.addSession(enreg).subscribe(() => {
                  this.session
                    .getSessionsBySequence(this.sequenceSelected)
                    .subscribe((res) => {
                      this.listeSession = res;
                    });
                  this.formSession.patchValue({
                    session: '',
                  });
                });
                break;
              case 'Modifier':
                this.session
                  .modifSession(this.sessionId, enreg)
                  .subscribe(() => {
                    this.session
                      .getSessionsBySequence(this.sequenceSelected)
                      .subscribe((res) => {
                        this.listeSession = res;
                      });
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

  supprSession(id) {
    this.session.supprSession(id).subscribe(() => {
      this.session
        .getSessionsBySequence(this.sequenceSelected)
        .subscribe((res) => {
          this.listeSession = res;
        });
    });
  }
}
