import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ListUsersService } from './list-users.service'

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit {

  form_users: FormGroup
  list_users: any = []

  constructor(
    private form_builder: FormBuilder,
    private list_users_service: ListUsersService
  ) { }

  ngOnInit(): void {
    this.form_users = this.form_builder.group({
      login: ['', []]
    });

    this.list_users_service.getAll()
      .subscribe(
        response => {
          // console.log(response)
          this.list_users = response
        },
        error => {
          alert('An error occured during retrieving data.')
        }
      )
  }

  delete(id: number) {
    console.log('id à supprimer : ' + id)
    this.list_users_service.deleteuser(id)
      .subscribe(
        response => {
          alert('Utilisateur Supprimé');
          this.ngOnInit();
        },
        err => {
          alert('Erreur de suppression');
        }
      )
  }

}
