import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  texte: string;
}

@Component({
  selector: 'app-aqiboost-dialog',
  templateUrl: './aqiboost-dialog.component.html',
  styleUrls: ['./aqiboost-dialog.component.css'],
})
export class AqiboostDialogComponent implements OnInit {
  texte_dialog: '';

  constructor(
    public dialogRef: MatDialogRef<AqiboostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {
    this.dialogRef.close();
  }
}
