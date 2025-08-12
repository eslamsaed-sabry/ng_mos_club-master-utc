import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { ManagementService } from 'src/app/services/management.service';
import { dialogFAQData, IFAQ } from 'src/app/models/management.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-faq-form',
    templateUrl: './faq-form.component.html',
    styleUrls: ['./faq-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class FaqFormComponent implements OnInit {
  faq: IFAQ = {} as IFAQ;

  constructor(public dialogRef: MatDialogRef<FaqFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogFAQData, private managementService: ManagementService) { }

  ngOnInit(): void {
    if (this.data.type === 'edit') {
      this.faq = this.data.faq!;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.managementService.addFAQ(this.faq).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.managementService.editFAQ(this.faq).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }

}
