import { AppComponent } from './../app.component';
import { EspaceEnfantService } from './../espace-enfants/espace-enfant.service';
import { environment } from './../../environments/environment_aqiboost';
import { StripeScriptService } from './stripe-script.service';
import { AqiboostDialogComponent } from './../aqiboost-dialog/aqiboost-dialog.component';
import { Uuid } from 'aws-sdk/clients/groundstation';
import { AqiboostEmailService } from './../aqiboost-email.service';
import { InscriptionParentsService } from './inscription-parents.service';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-inscription-parents',
  templateUrl: './inscription-parents.component.html',
  styleUrls: ['./inscription-parents.component.css'],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .card.disabled {
        opacity: 0.5;
      }
    `,
  ],
})
export class InscriptionParentsComponent implements OnInit, OnDestroy {
  InscriptionParent: FormGroup;
  InscriptionEnfant: FormGroup;
  email_existant = false;
  num_etape: number = 0;
  texte_etape = '';
  id: Uuid;
  nom_parent: '';
  prenom_parent: '';
  email_parent: '';
  mdp: '';
  mdp_confirm: '';
  showToast = true;
  sent_email = false;
  sent_mail_info = '';
  mdp_invalid = false;
  mdp_text_error = '';
  mdpConfirm_invalid = false;
  mdpConfirm_text_error = '';
  alert_nom = false;
  alert_prenom = false;
  alert_email = false;
  formValid = false;
  lib_card_header = 'Inscription des parents';
  nom_enfant = '';
  alert_nom_enfant = false;
  prenom_enfant = '';
  alert_prenom_enfant = false;
  formEnfantValid = false;
  lib_precedent = '<< Précédent';
  lib_suivant = 'Suivant >>';
  DateNaissance = new Date();
  alert_date = false;
  liste_niveau: any[] = [];
  niveau_selected: Number;
  identifiant: '';
  alert_identifiant = false;
  liste_enfant: any;
  type_paiement: Number;
  paiement_mois_checked = false;
  paiement_annee_checked = false;
  montantAPayer = 0;
  paiementEnCours = false;
  nb_enfant = 0;
  modalRef: any;
  lib_ajout_modif_enfant = 'Ajouter enfant';
  id_enfant: '';
  texte_dialog: String;
  result_dialog: Number;
  paiement = true;
  closeResult = '';
  disabled = true;
  paiementChecked = true;
  enfants_abonne: any[] = [];
  nbEnfantNonAbonne = 0;
  enfantsNonAbonnes: any[] = [];
  listeAbonnement: any[] = [];
  idExistant = false;

  // @ViewChild('cardInfo') private cardInfo: ElementRef;
  @ViewChild('cardInfo') cardInfo;

  card: any;
  result: any;
  _totalAmount: number;
  cardHandler = this.onChange.bind(this);
  cardError: string;
  private stripeLoaded: boolean;

  constructor(
    private form_builder: FormBuilder,
    private Parent: InscriptionParentsService,
    private EmailService: AqiboostEmailService,
    private route: ActivatedRoute,
    private Toast: ToastrService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<InscriptionParentsComponent>,
    public dialog: MatDialog,
    private stripeScriptService: StripeScriptService,
    private enfantService: EspaceEnfantService,
    private AppComponent: AppComponent
  ) {
    this.id = this.route.snapshot.params.id;
    this.AppComponent.menuVisible = false;
  }

  ngOnInit(): void {
    this.InscriptionParent = this.form_builder.group({
      Nom: ['', [Validators.required]],
      Prenom: ['', [Validators.required]],
      // email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      Adresse: ['', [Validators.required]],
      CodePostal: ['', [Validators.required]],
      Ville: ['', [Validators.required]],
      TelephoneMobile: ['', [Validators.required]],
      MotDePasse: ['', [Validators.required]],
    });
    this.InscriptionEnfant = this.form_builder.group({
      Nom: ['', [Validators.required]],
      Prenom: ['', [Validators.required]],
      Date_Naissance: ['', [Validators.required]],
      Identifiant: ['', [Validators.required]],
      MotDePasse: ['', [Validators.required]],
      MDPConfirm: ['', []],
    });

    if (this.id == 'new') {
      this.nom_parent = '';
      this.prenom_parent = '';
      this.num_etape = 0;
      this.texte_etape = 'Étape 1 sur 4';
    } else {
      this.num_etape = 1;
      this.texte_etape = 'Étape 2 sur 4';
      this.Parent.searchParentById(this.id).subscribe((res) => {
        let data_parent: any = res;
        this.nom_parent = data_parent[0].Nom;
        this.prenom_parent = data_parent[0].Prenom;
        this.email_parent = data_parent[0].Email;
        this.InscriptionParent.patchValue({
          Nom: data_parent[0].Nom,
          Prenom: data_parent[0].Prenom,
          email: data_parent[0].Email,
          Adresse: data_parent[0].Adresse,
          CodePostal: data_parent[0].CodePostal,
          Ville: data_parent[0].Ville,
          TelephoneMobile: data_parent[0].TelephoneMobile,
        });
      });
    }

    let i = 0;
    for (i = 0; i < 4; i++) {
      this.liste_niveau.push({
        niveau: 'Niveau ' + (i + 1),
        num: i + 1,
      });
    }
  }

  nombreEnfantsAbonnes() {
    this.Parent.getParentPayment(this.id).subscribe((res) => {
      let enfantAbonne = false;
      const dateSys = new Date();
      let i = -1;
      let nomEnfant = '';
      let typePaiement = '';

      this.enfants_abonne.splice(0, this.enfants_abonne.length);
      this.listeAbonnement.splice(0, this.listeAbonnement.length);
      res.forEach((element) => {
        this.enfants_abonne.push({
          id_enfant: element.EnfantId,
          type_paiement: element.TypePaiement,
          date: element.Date,
        });
        this.Parent.getEnfant(element.EnfantId).subscribe((resEnfant) => {
          nomEnfant = resEnfant[0].Prenom + ' ' + resEnfant[0].Nom;
          switch (element.TypePaiement) {
            case 0:
              typePaiement = 'Mois';
              break;
            case 1:
              typePaiement = 'Année';
              break;
          }
          this.listeAbonnement.push({
            nom_enfant: nomEnfant,
            type_paiement: typePaiement,
            date: element.Date,
            montant: element.Montant,
          });
        });
      });
      this.enfantsNonAbonnes.splice(0, this.enfantsNonAbonnes.length);
      this.liste_enfant.forEach((enfant) => {
        enfantAbonne = false;
        this.enfants_abonne.forEach((enfant_abonne) => {
          i++;
          let datePaiement = new Date(enfant_abonne.date);
          if (enfant.id == enfant_abonne.id_enfant) {
            enfantAbonne = true;
            switch (enfant_abonne.type_paiement) {
              case 0:
                if (
                  datePaiement.getMonth() == dateSys.getMonth() &&
                  datePaiement.getFullYear() == dateSys.getFullYear()
                ) {
                  enfantAbonne = true;
                } else {
                  if (dateSys.getMonth() != datePaiement.getMonth()) {
                    enfant_abonne = false;
                    this.enfants_abonne.splice(i, 1);
                    i--;
                  }
                }
                break;
              case 1:
                if (datePaiement.getFullYear() == dateSys.getFullYear()) {
                  enfant_abonne = true;
                } else {
                  enfant_abonne = false;
                  this.enfants_abonne.splice(i, 1);
                  i--;
                }
                break;
            }
          }
        });
        if (enfantAbonne == false) {
          this.enfantsNonAbonnes.push({ EnfantId: enfant.id });
        }
      });

      this.nbEnfantNonAbonne = this.enfantsNonAbonnes.length;
      if (this.enfants_abonne.length > 0) {
        switch (this.enfants_abonne[0].type_paiement) {
          case 0:
            this.paiement_mois_checked = true;
            this.paiement_annee_checked = false;
            break;
          case 1:
            this.paiement_annee_checked = true;
            this.paiement_mois_checked = false;
            break;
        }
        this.paiementChecked = false;
      }
      this.checkPaiement();
    });
  }

  get Date_Naissance() {
    return this.InscriptionEnfant.get('Date_Naissance');
  }
  get email() {
    return this.InscriptionParent.get('email');
  }

  controleSaisies() {
    switch (this.num_etape) {
      case 0:
        if (!this.nom_parent) {
          this.alert_nom = true;
        }
        if (!this.prenom_parent) {
          this.alert_prenom = true;
        }
        if (!this.email_parent) {
          this.alert_email = true;
        }
        break;

      case 2:
        if (!this.nom_enfant) {
          this.alert_nom_enfant = true;
          this.formEnfantValid = false;
        }
        if (!this.prenom_enfant) {
          this.alert_prenom_enfant = true;
          this.formEnfantValid = false;
        }
        if (!this.DateNaissance) {
          this.alert_date = true;
        }
        if (!this.identifiant) {
          this.alert_identifiant = true;
          this.formEnfantValid = false;
        }
        if (!this.mdp) {
          this.mdp_invalid = true;
          this.mdp_text_error = 'Mot de passe manquant';
          this.formEnfantValid = false;
        } else {
          if (this.mdp != this.mdp_confirm) {
            this.mdpConfirm_invalid = true;
            this.mdpConfirm_text_error = 'Mot de passe non confirmé';
            this.formEnfantValid = false;
          } else {
            if (this.mdp == this.mdp_confirm) {
              this.formEnfantValid = true;
            }
          }
        }
    }
  }

  ValiderEtape() {
    this.controleSaisies();
    switch (this.num_etape) {
      case 0:
        if (this.nom_parent && this.prenom_parent && this.email_parent) {
          this.Parent.findParentEmail(this.email_parent).subscribe((res) => {
            if (res.length > 0) {
              this.email_existant = true;
            } else {
              const enreg = this.InscriptionParent.value;
              this.Parent.createParent(enreg).subscribe(
                (res) => {
                  if (res.id != '') {
                    this.id = res.id;
                    let user = {
                      name: res.Prenom + ' ' + res.Nom,
                      email: res.Email,
                      subject: 'Validation inscription Parents sur Aqiboost',
                      html:
                        '<b>http://localhost:4200/inscription_parent/' +
                        res.id +
                        '<b>',
                    };
                    this.EmailService.send_email(user).subscribe((res) => {
                      if (res == 'error_sending_email') {
                        this.erreurEnvoieEmail();
                        // si email non envoyé, supprimer l'enregistrement
                        if (this.id != '') {
                          this.Parent.deleteParent(this.id).subscribe((res) => {
                            console.log(res);
                          });
                        }
                      } else {
                        this.Toast.info(
                          'Veuillez cliquer sur le lien envoyé à ' +
                            user.email +
                            " pour poursuivre l'inscription.",
                          '',
                          {
                            timeOut: 5000,
                            positionClass: 'toast-top-center',
                          }
                        );
                      }
                    });
                  }
                },
                (error) => {
                  this.erreurEnvoieEmail();
                  console.log(error);
                }
              );
            }
          });
        }
        break;

      case 1:
        if (this.id != '') {
          if (this.mdp == '' || this.mdp == 'undefined' || !this.mdp) {
            this.mdp_invalid = true;
            this.mdp_text_error = 'Mot de passe manquant';
          } else {
            if (this.mdp != this.mdp_confirm) {
              this.mdpConfirm_invalid = true;
              this.mdpConfirm_text_error = 'Mot de passe non confirmé';
            } else if (this.mdp == this.mdp_confirm) {
              let enreg = this.InscriptionParent.value;
              this.Parent.majParent(this.id, enreg).subscribe((res) => {
                this.Toast.info('Inscription parent OK', '', {
                  timeOut: 3000,
                  positionClass: 'toast-top-center',
                });
                this.etapeSuivante();
                this.mdp = '';
                this.mdp_invalid = false;
                this.mdp_confirm = '';
                this.mdpConfirm_invalid = false;
                this.InscriptionEnfant.patchValue({ MotDePasse: '' });
              });
            }
          }
        }
        break;

      case 2:
        if (this.formEnfantValid == true) {
          const enreg = this.InscriptionEnfant.value;
          enreg.Niveau = this.niveau_selected;
          // enreg.date_naissance = this.DateNaissance;
          enreg.ParentId = this.id;
          if (!this.id_enfant) {
            this.enfantService
              .getEnfantByIdentifiant(this.identifiant)
              .subscribe((resEnfant) => {
                this.idExistant = false;
                if (resEnfant.length > 0) {
                  resEnfant.forEach((elementEnfant) => {
                    if (elementEnfant.id != this.id_enfant) {
                      this.idExistant = true;
                    }
                  });
                }
                if (!this.idExistant) {
                  this.Parent.createEnfant(enreg).subscribe(
                    (res) => {
                      this.Toast.info('Inscription enfant OK', '', {
                        timeOut: 3000,
                        positionClass: 'toast-top-center',
                      });
                      this.InscriptionEnfant.reset();
                      this.niveau_selected = 0;
                    },
                    (error) => {
                      this.Toast.error(
                        'Veuillez vérifier vos saisies',
                        'Donnée(s) invalide(s)',
                        {
                          timeOut: 3000,
                          positionClass: 'toast-top-center',
                        }
                      );
                      console.log(error);
                    }
                  );
                } else {
                  this.Toast.error(
                    'Identifiant déjà existant',
                    this.lib_card_header,
                    {
                      timeOut: 3000,
                      positionClass: 'toast-top-center',
                    }
                  );
                }
              });
          } else {
            this.enfantService
              .getEnfantByIdentifiant(this.identifiant)
              .subscribe((resEnfant) => {
                this.idExistant = false;
                if (resEnfant.length > 0) {
                  resEnfant.forEach((element) => {
                    if (element.id != this.id_enfant) {
                      this.idExistant = true;
                    }
                  });
                }
                if (!this.idExistant) {
                  this.Parent.updateEnfant(this.id_enfant, enreg).subscribe(
                    (res) => {
                      this.id_enfant = '';
                      this.lib_card_header = "Ajout d'enfant";
                      this.lib_ajout_modif_enfant = 'Ajouter enfant';
                      this.niveau_selected = 0;
                      this.Toast.info('Modification enfant OK', '', {
                        timeOut: 3000,
                        positionClass: 'toast-top-center',
                      });
                      this.InscriptionEnfant.reset();
                    },
                    (error) => {
                      this.Toast.error(
                        'Veuillez vérifier vos saisies',
                        'Donnée(s) invalide(s)',
                        {
                          timeOut: 3000,
                          positionClass: 'toast-top-center',
                        }
                      );
                      console.log(error);
                    }
                  );
                } else {
                  this.Toast.error(
                    'Identifiant déjà existant',
                    this.lib_card_header,
                    {
                      timeOut: 3000,
                      positionClass: 'toast-top-center',
                    }
                  );
                }
              });
          }
        }
    }
  }

  keyupNom(nom) {
    this.nom_parent = nom;
    this.alert_nom = false;
    if (!nom || !this.prenom_parent || !this.email_parent) {
      this.formValid = false;
    } else {
      this.formValid = true;
    }
  }

  keyupPrenom(prenom) {
    this.prenom_parent = prenom;
    this.alert_prenom = false;
    if (!this.nom_parent || !this.prenom_parent || !this.email_parent) {
      this.formValid = false;
    } else {
      this.formValid = true;
    }
  }

  keyupMail(email) {
    this.email_parent = email;
    this.alert_email = false;
    if (!this.nom_parent || !this.prenom_parent || !this.email_parent) {
      this.formValid = false;
    } else {
      this.formValid = true;
    }
  }

  keyupEmail() {
    this.email_existant = false;
  }

  keyupMdp(mdp) {
    this.mdp = mdp;
    this.mdp_invalid = false;
    this.mdpConfirm_invalid = false;
  }

  keyupMdpConfirm(mdpConfirm) {
    this.mdp_confirm = mdpConfirm;
    this.mdpConfirm_invalid = false;
  }

  keyupNomEnfant(nom) {
    this.nom_enfant = nom;
    this.alert_nom_enfant = false;
    if (
      !nom ||
      !this.prenom_enfant ||
      !this.DateNaissance ||
      !this.identifiant
    ) {
      this.formEnfantValid = false;
    } else {
      this.formEnfantValid = true;
    }
  }

  keyupPrenomEnfant(prenom) {
    this.prenom_enfant = prenom;
    this.alert_prenom_enfant = false;
    if (
      !prenom ||
      !this.nom_enfant ||
      !this.DateNaissance ||
      !this.identifiant
    ) {
      this.formEnfantValid = false;
    } else {
      this.formEnfantValid = true;
    }
  }

  keyupIdentifiant(id) {
    this.identifiant = id;
    this.alert_identifiant = false;
    if (
      !this.identifiant ||
      !this.prenom_enfant ||
      !this.nom_enfant ||
      !this.DateNaissance
    ) {
      this.formEnfantValid = false;
    } else {
      this.formEnfantValid = true;
    }
  }

  keyupDate(date) {
    this.DateNaissance = date;
    this.alert_date = false;
    if (!this.DateNaissance || !this.nom_enfant || !this.prenom_enfant) {
      this.formEnfantValid = false;
    } else {
      this.formEnfantValid = true;
    }
  }

  erreurEnvoieEmail() {
    this.Toast.error("L'email n'a pas pu être envoyé", '', {
      tapToDismiss: true,
      positionClass: 'toast-top-center',
    });
  }

  isValidForm() {
    return this.formValid;
  }

  etapePrecedente() {
    this.num_etape--;
    this.mdp = '';
    this.mdp_invalid = false;
    this.mdp_confirm = '';
    this.mdpConfirm_invalid = false;
    switch (this.num_etape) {
      case 1:
        this.lib_card_header = 'Inscription des parents';
        this.texte_etape = 'Étape 2 sur 4';
        this.InscriptionParent.patchValue({ MotDePasse: '' });
        break;
      case 2:
        this.texte_etape = 'Étape 3 sur 4';
        this.refreshFormEnfant();
        this.ngOnDestroy();
        break;
    }
  }

  etapeSuivante() {
    this.num_etape++;
    switch (this.num_etape) {
      case 2:
        this.texte_etape = 'Étape 3 sur 4';
        this.refreshFormEnfant();
        break;
      case 3:
        this.lib_card_header = 'Récapitulatif des enfants abonnés';
        this.texte_etape = 'Étape 4 sur 4';
        this.Parent.listeEnfant(this.id).subscribe((res) => {
          this.liste_enfant = res;
          this.nb_enfant = this.liste_enfant.length;
          this.liste_enfant.forEach((element) => {
            if (element.Niveau > 0) {
              element.Niveau = 'Niveau ' + element.Niveau;
            }
          });
          this.nombreEnfantsAbonnes();
        });
        this.initStripe();
        break;
    }
  }

  abonnementEnfant(EnfantId) {
    // if (this.enfants_abonne.indexOf(EnfantId) == -1) {
    //   return false;
    // } else {
    //   return true;
    // }
    let abonne = false;
    this.enfants_abonne.forEach((element) => {
      if (element.id_enfant == EnfantId) {
        abonne = true;
      }
    });
    return abonne;
  }

  refreshFormEnfant() {
    if (!this.id_enfant) {
      this.InscriptionEnfant.reset();
      this.nom_enfant = '';
      this.prenom_enfant = '';
      this.identifiant = '';
      this.niveau_selected = 0;
      this.lib_card_header = "Ajout d'enfant";
      this.lib_ajout_modif_enfant = 'Ajouter enfant';
    } else {
      this.lib_card_header = "Modification d'enfant";
      this.lib_ajout_modif_enfant = 'Valider les modifications';
    }
  }

  niveauSelected(niveau) {
    this.niveau_selected = niveau;
  }

  selection_type(number) {
    this.type_paiement = number;
    switch (this.type_paiement) {
      case 0:
        this.paiement_mois_checked = true;
        this.paiement_annee_checked = false;
        // this.checkPaiement()
        break;
      case 1:
        this.paiement_mois_checked = false;
        this.paiement_annee_checked = true;
    }
    this.checkPaiement();
  }

  afficherEnfant(id) {
    this.id_enfant = id;
    this.Parent.getEnfant(id).subscribe((res) => {
      this.InscriptionEnfant.patchValue({
        Nom: res[0].Nom,
        Prenom: res[0].Prenom,
        Identifiant: res[0].Identifiant,
      });
      if (res[0].DateNaissance == null) {
        this.InscriptionEnfant.patchValue({
          Date_Naissance: '',
        });
      } else {
        this.InscriptionEnfant.patchValue({
          Date_Naissance: this.formatDate(res[0].DateNaissance),
        });
      }
      this.nom_enfant = res[0].Nom;
      this.prenom_enfant = res[0].Prenom;
      this.identifiant = res[0].Identifiant;
      this.DateNaissance = res[0].DateNaissance;
      this.niveau_selected = res[0].Niveau;
      this.alert_nom_enfant = false;
      this.alert_prenom_enfant = false;
      this.alert_identifiant = false;
      this.etapePrecedente();
    });
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }

  deleteEnfant() {
    this.result_dialog = 0;
    const dialogRef = this.dialog.open(AqiboostDialogComponent, {
      width: '480px',
      data: {
        texte:
          'Voulez-vous vraiment supprimer ' +
          this.prenom_enfant +
          ' ' +
          this.nom_enfant +
          ' ?',
      },
    });

    dialogRef.afterClosed().subscribe((result: Number) => {
      if (result == 1) {
        this.Parent.delete_Enfant(this.id_enfant).subscribe((res) => {
          this.Toast.info('Suppression enfant OK', '', {
            timeOut: 3000,
            positionClass: 'toast-top-center',
          });
          this.InscriptionEnfant.reset();
          this.id_enfant = '';
          this.refreshFormEnfant();
        });
      }
    });
  }

  ajouterEnfant() {
    this.id_enfant = '';
    this.formEnfantValid = false;
    this.etapePrecedente();
  }

  open(popup_name) {
    this.modalService
      .open(popup_name, { ariaLabelledBy: 'modal-basic-title' })
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

  checkPaiement() {
    if (this.paiement_mois_checked) {
      this.montantAPayer =
        environment.payment.stripe.tarifMois * this.nbEnfantNonAbonne;
    }
    if (this.paiement_annee_checked) {
      this.montantAPayer =
        environment.payment.stripe.tarifAnnee * this.nbEnfantNonAbonne;
    }
  }

  abonnement(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  // -------------------------------stripe-----------------------------

  ngOnDestroy() {
    if (this.card) {
      // We remove event listener here to keep memory clean
      this.card.removeEventListener('change', this.cardHandler);
      this.card.destroy();
      this.stripeLoaded = false;
    }
  }

  initStripe() {
    if (!this.stripeLoaded) {
      this.stripeScriptService.registerScript(() => {
        const cardStyle = {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
          },
        };
        this.card = elements.create('card', { style: cardStyle });
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
        this.stripeLoaded = true;
      });
    }
  }

  onChange({ error }) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }

  async createStripeToken() {
    this.paiementEnCours = true;
    const { token, error } = await stripe.createToken(this.card);
    if (token) {
      this.onSuccess(token);
    } else {
      this.onError(error);
      this.paiementEnCours = false;
    }
  }

  onSuccess(token) {
    // this.dialogRef.close({ token });
    let payment: any = {};
    payment.amount = this.montantAPayer;
    payment.description =
      'Aqiboost - Paiement de ' + this.prenom_parent + ' ' + this.nom_parent;
    // payment.
    console.log(token);
    this.cardInfo = token;
    this.Parent.stripePayment(payment).subscribe((res) => {
      console.log(res.clientSecret);
      let _this = this;
      stripe
        .confirmCardPayment(res.clientSecret, {
          payment_method: {
            card: this.card,
          },
        })
        .then(function (result) {
          if (result.error) {
            // Show error to your customer
            _this.showError(result.error.message);
            this.paiementEnCours = false;
          } else {
            // The payment succeeded!
            _this.orderComplete(result.paymentIntent.id);
            _this.MAJApresPaiement();
          }
        });
    });
  }

  onError(error) {
    if (error.message) {
      this.cardError = error.message;
    }
  }

  // Shows a success message when the payment is complete
  orderComplete(paymentIntentId) {
    this.paiementEnCours = false;
    // Enregistrer le paiement dans la base
    const enreg: any = {};
    let dateSys = new Date();
    enreg.ParentId = this.id;
    enreg.Date = dateSys;
    if (this.paiement_mois_checked) {
      enreg.Montant = environment.payment.stripe.tarifMois;
      enreg.TypePaiement = 0;
    }
    if (this.paiement_annee_checked) {
      enreg.Montant = environment.payment.stripe.tarifAnnee;
      enreg.TypePaiement = 1;
    }
    let nbInfo = 0;
    this.enfantsNonAbonnes.forEach((element) => {
      enreg.EnfantId = element.EnfantId;
      console.log(enreg);
      this.Parent.addPayment(enreg).subscribe(
        (res) => {
          nbInfo++;
          if (nbInfo == 1) {
            this.Toast.info('Paiement OK', 'Aqiboost', {
              timeOut: 3000,
              positionClass: 'toast-top-center',
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
  }

  // Show the customer the error from Stripe if their card fails to charge
  showError(errorMsgText) {
    this.Toast.error('Paiement échoué : ' + errorMsgText, 'Aqiboost', {
      timeOut: 3000,
      positionClass: 'toast-top-center',
    });
  }

  MAJApresPaiement() {
    this.Parent.listeEnfant(this.id).subscribe((res) => {
      this.liste_enfant = res;
      this.nombreEnfantsAbonnes();
    });
  }
}
