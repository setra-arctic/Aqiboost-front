import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fiche-user',
  templateUrl: './fiche-user.component.html',
  styleUrls: ['./fiche-user.component.css']
})
export class FicheUserComponent implements OnInit {
  form_fiche_user: FormGroup
  constructor() { }

  ngOnInit(): void {
  }

}
