import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    imports: [MatDialogTitle, MatDialogActions, MatButtonModule, TranslateModule]
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mainTitle: string, subTitle: string }) { }

  ngOnInit(): void {
  }


  dismiss(): void {
    this.dialogRef.close({ status: 'no'});
  }

  confirm(){
    this.dialogRef.close({ status: 'yes'});
  }

}
