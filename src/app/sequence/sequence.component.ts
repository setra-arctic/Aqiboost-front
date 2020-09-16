import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css'],
})
export class SequenceComponent implements OnInit {
  listeSequence: any = [];

  constructor() {}

  ngOnInit(): void {}
}
