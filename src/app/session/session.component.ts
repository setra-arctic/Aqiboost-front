import { ToastrService } from 'ngx-toastr';
import { ListeExercicesService } from './../liste-exercices/liste-exercices.service';
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
  idExerciceSelected: Uuid;
  listeSequence: any = [];
  listeSession: any = [];
  listeExercice: any = [];
  listeSessionExercice: any = [];
  formSession: FormGroup;
  invalidSession = false;
  sessionMode = 'Ajouter';
  sessionId: Uuid;
  closeResult = '';
  selectedSequence = true;
  nom_session: '';

  constructor(
    private sequence: SequenceService,
    private form_builder: FormBuilder,
    private modalService: NgbModal,
    private session: SessionService,
    private Toast: ToastrService,
    private baseExercice: ListeExercicesService
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
    if (this.listeExercice.length == 0) {
      this.baseExercice.getBaseExercices().subscribe((res) => {
        this.listeExercice = res;
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
    } else if (mode == 'Modifier' || mode == 'sessionExercice') {
      this.session.getASession(id).subscribe((res) => {
        this.formSession.patchValue({
          session: res[0].session,
        });
        this.nom_session = res[0].session;
      });
      this.sessionId = id;

      if (mode == 'sessionExercice') {
        this.session.getSessionExercice(id).subscribe((res) => {
          this.listeSessionExercice = res;
        });
      }
    }
  }

  open(popup, size) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: size })
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

  selectExercice(id) {
    this.idExerciceSelected = id;
  }

  createSessionExercice(sessionId, baseExerciceId) {
    let enreg: any = {};
    let exerciceExistant = false;

    this.listeSessionExercice.forEach((element) => {
      if (element.baseExerciceId == baseExerciceId) {
        exerciceExistant = true;
      }
    });

    if (!exerciceExistant) {
      enreg.sessionId = sessionId;
      enreg.baseExerciceId = baseExerciceId;
      this.session.createSessionExercice(enreg).subscribe(() => {
        this.modifieSessionMode('sessionExercice', sessionId);
      });
    }
  }
}
