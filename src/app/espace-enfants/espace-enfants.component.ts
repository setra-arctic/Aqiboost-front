import { ToastrService } from 'ngx-toastr';
import { InscriptionParentsService } from './../inscription-parents/inscription-parents.service';
import { EspaceEnfantService } from './espace-enfant.service';
import { AppComponent } from './../app.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-espace-enfants',
  templateUrl: './espace-enfants.component.html',
  styleUrls: ['./espace-enfants.component.css'],
})
export class EspaceEnfantsComponent implements OnInit {
  num_etape: number = 0;
  formEnfant: FormGroup;
  idInvalide = false;
  errorIdentifiant = '';
  enfantAbonne = false;
  pwdEnfant = '';

  constructor(
    private form_builder: FormBuilder,
    private appComponent: AppComponent,
    private enfant: EspaceEnfantService,
    private Toast: ToastrService,
    private paiementParent: InscriptionParentsService,
    private router: Router
  ) {
    this.appComponent.menuVisible = false;
  }

  ngOnInit(): void {
    this.formEnfant = this.form_builder.group({
      Identifiant: ['', [Validators.required]],
      MotDePasse: ['', [Validators.required]],
    });
  }

  validerLogin(idEnfant) {
    if (!idEnfant) {
      this.errorIdentifiant = 'Identifiant invalide';
      this.idInvalide = true;
    } else {
      this.enfant.getEnfantByIdentifiant(idEnfant).subscribe((res) => {
        if (res.length > 0) {
          const dateSys = new Date();
          // Vérifier si l'enfant est abonné
          this.paiementParent
            .searchEnfant(res[0].id)
            .subscribe((resPaiement) => {
              if (resPaiement.length > 0) {
                resPaiement.forEach((element) => {
                  let datePaiement = new Date(element.Date);
                  // datePaiement = element.Date;
                  if (element.TypePaiement == 0) {
                    if (
                      datePaiement.getMonth() >= dateSys.getMonth() &&
                      datePaiement.getFullYear() == dateSys.getFullYear()
                    ) {
                      this.enfantAbonne = true;
                    }
                  }
                  if (element.TypePaiement == 1) {
                    if (datePaiement.getFullYear() >= dateSys.getFullYear()) {
                      this.enfantAbonne = true;
                    }
                  }
                });
              } else {
                this.errorIdentifiant = 'Identifiant invalide';
                this.idInvalide = true;
              }
              if (this.enfantAbonne) {
                if (!this.pwdEnfant) {
                  this.Toast.error('Mot de passe invalide', '', {
                    timeOut: 3000,
                    positionClass: 'toast-top-center',
                  });
                } else {
                  this.enfant
                    .verifyPWD(res[0].id, this.pwdEnfant)
                    .subscribe((res) => {
                      if (res == true) {
                        this.Toast.info('PWD OK', '', {
                          timeOut: 3000,
                          positionClass: 'toast-top-center',
                        });
                        this.router.navigate(['exemple_matrice']);
                      } else {
                        this.Toast.error('Mot de passe invalide', '', {
                          timeOut: 3000,
                          positionClass: 'toast-top-center',
                        });
                      }
                    });
                }
              } else {
                this.errorIdentifiant = 'Identifiant invalide';
                this.idInvalide = true;
              }
            });
        } else {
          this.errorIdentifiant = 'Identifiant invalide';
          this.idInvalide = true;
        }
      });
    }
  }

  keyupPWD(pwd) {
    this.enfantAbonne = false;
    this.idInvalide = false;
    this.pwdEnfant = pwd;
  }

  keyupIdentifiant(identifiant) {
    this.enfantAbonne = false;
    this.idInvalide = false;
  }
}
