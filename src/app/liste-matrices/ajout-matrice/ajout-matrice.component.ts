import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ɵConsole } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { AjoutMatriceService } from './ajout-matrice.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ajout-matrice',
  templateUrl: './ajout-matrice.component.html',
  styleUrls: ['./ajout-matrice.component.css'],
})
export class AjoutMatriceComponent implements OnInit {
  FormAjoutMatrice: FormGroup;
  popupPE: FormGroup;
  ModeOverture: string;
  id: '';
  titre_form_matrice: string;
  enreg: any = [];
  url: any;
  url_image: any = [];
  image_url: '';
  closeResult = '';
  listeParamEntree: any = [];
  ajoutModifParam = 'Ajouter';

  constructor(
    private matrice_service: AjoutMatriceService,
    private router: Router,
    private form_builder: FormBuilder,
    private modalService: NgbModal,
    private Toast: ToastrService,
    private route: ActivatedRoute
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    this.FormAjoutMatrice = this.form_builder.group({
      Titre_matrice: ['', [Validators.required]],
      Descriptif_matrice: [],
      Numero_matrice: [],
      NomPage: [],
      ParamSortie: [],
      PhotoMatrice: [],
    });

    this.popupPE = this.form_builder.group({
      nomPE: [],
      valeurPE: [],
    });

    if (this.id == '') {
      this.titre_form_matrice = 'Ajout matrice';
    } else if (this.id != '') {
      this.titre_form_matrice = 'Modif matrice';
      this.matrice_service.Get_matrice(this.id).subscribe(
        (response) => {
          this.enreg = response;
          this.FormAjoutMatrice.patchValue({
            Titre_matrice: this.enreg.Titre,
            Descriptif_matrice: this.enreg.DescriptifMatrice,
            Numero_matrice: this.enreg.NumeroMatrice,
            NomPage: this.enreg.NomPage,
            ParamSortie: this.enreg.ParametresSortie,
          });
          this.listeParamEntree = this.enreg.ParametresEntree;
          if (this.enreg.Image_ != '') {
            this.url = this.enreg.Image_;
          }
        },
        (err) => {
          alert('Error');
        }
      );
    }
  }

  ajout_matrice_exercice() {
    const data = this.FormAjoutMatrice.value;
    if (this.id == '') {
      // Ajout
      this.matrice_service
        .Cherche_titre_matrice_noId(data.Titre_matrice)
        .subscribe((response) => {
          if (response == '') {
            const enreg = this.FormAjoutMatrice.value;
            enreg.url_image = this.image_url;
            enreg.ParamEntree = this.listeParamEntree;
            this.matrice_service.Ajout_matrice(enreg).subscribe(
              (response) => {
                this.router.navigate(['/liste_matrices']);
              },
              (error) => {
                alert('Error');
              }
            );
          } else {
            alert('Titre matrice déjà existant');
          }
        });
    } else if (this.id != '') {
      // Modif
      this.matrice_service
        .Cherche_titre_matrice(data.Titre_matrice, this.id)
        .subscribe((response) => {
          if (response == '') {
            const enreg = this.FormAjoutMatrice.value;
            enreg.url_image = this.image_url;
            this.matrice_service.Modif_matrice(this.id, enreg).subscribe(
              (response) => {
                this.router.navigate(['/liste_matrices']);
              },
              (error) => {
                alert('Error');
              }
            );
          } else {
            alert('Titre matrice déjà existant');
          }
        });
    }
  }

  // upload image
  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target.result;
      };

      const file = event.target.files[0];
      this.matrice_service.uploadAvatar(file).subscribe((events) => {
        let result: any = [];

        result = events;
        this.url_image = result.body;
        if (this.url_image != undefined) {
          this.image_url = result.body.imageUrl;
        }
      });
    }
  }

  onFileChanged(event) {
    const file = event.target.files[0];
  }

  supprImage() {
    this.url = '';
    this.image_url = '';
  }

  open(popup) {
    this.modalService
      .open(popup, { ariaLabelledBy: 'modal-basic-title', size: 'sl' })
      .result.then(
        (result) => {
          if (result == 'ajoutPE') {
            let res: any = [];
            res = this.popupPE.value;
            this.ajoutParamEntree(res.nomPE, res.valeurPE);
          }
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
      console.log(1, reason);
      return `with: ${reason}`;
    }
  }

  ajoutParamEntree(nom, valeur) {
    let paramExistant = false;
    let i = -1;
    let j = i;
    if (!nom) {
    } else {
      this.listeParamEntree.forEach((element) => {
        i++;
        if (element.nom == nom) {
          paramExistant = true;
          j = i;
        }
      });
      if (!paramExistant) {
        if (
          this.listeParamEntree.push({
            nom: nom,
            valeur: valeur,
          }) > 0
        ) {
          this.popupPE.reset();
        }
      } else {
        if (this.ajoutModifParam == 'Ajouter') {
          this.Toast.error('Paramètre déjà existant', '', {
            timeOut: 2000,
            positionClass: 'toast-top-center',
          });
        } else {
          if (j >= 0) {
            this.listeParamEntree[j].nom = nom;
            this.listeParamEntree[j].valeur = valeur;
            this.ajoutModifParam = 'Ajouter';
            this.popupPE.reset();
          }
        }
      }
    }
  }

  afficherPE(nom, valeur) {
    this.popupPE.patchValue({
      nomPE: nom,
      valeurPE: valeur,
    });
    this.ajoutModifParam = 'Modifier le paramètre';
  }

  supprParam(nom) {
    let i = -1;
    let j = i;
    this.listeParamEntree.forEach((element) => {
      i++;
      if (element.nom == nom) {
        j = i;
      }
    });
    if (j >= 0) {
      this.listeParamEntree.splice(j, 1);
    }
  }
}
