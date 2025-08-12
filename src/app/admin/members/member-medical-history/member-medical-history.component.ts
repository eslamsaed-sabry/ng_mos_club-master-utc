import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { map, tap } from 'rxjs';
import { RoleDirective } from 'src/app/directives/role.directive';
import { IMedicalHistory } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-member-medical-history',
    imports: [CommonModule, FormsModule, TranslateModule, MatDialogModule, MatRadioModule, MatInputModule, MatButtonModule,
        RoleDirective],
    templateUrl: './member-medical-history.component.html',
    styleUrl: './member-medical-history.component.scss'
})
export class MemberMedicalHistoryComponent {
  destroyRef = inject(DestroyRef);
  medicalHistoryForm = {} as IMedicalHistory;
  private memberService = inject(MemberService);
  toastr = inject(ToastrService);
  translate = inject(TranslateService);
  medicalHistory$ = this.memberService.getMembersMedicalHistory(this.data.memberId).pipe(
    map(res => res.data),
    tap((res: IMedicalHistory) => {
      this.medicalHistoryForm = res;
    }));

  constructor(public dialogRef: MatDialogRef<MemberMedicalHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { memberId: number }) {
    this.medicalHistoryForm.memberId = this.data.memberId;
  }

  dismiss() {
    this.dialogRef.close();
  }

  update(form: NgForm) {
    if (form.form.valid) {
      this.memberService.updateMedicalHistory(this.medicalHistoryForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next:()=>{this.dismiss()}
      })
    } else {
      this.toastr.error(this.translate.instant('medicalHistory.allQRequired'))
    }
  }


}
