import { CommonModule } from '@angular/common';
import { Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Gender, LookupType } from 'src/app/models/enums';
import { IBulkPotentialMembersUploadForm } from 'src/app/models/member.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';

@Component({
    selector: 'app-upload-bulk-members',
    imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule, MatSelectModule,
        MatInputModule, FormsModule, MatIcon],
    templateUrl: './upload-bulk-members.component.html'
})
export class UploadBulkMembersComponent {
  @ViewChild('fileUpload') fileUpload:ElementRef<HTMLInputElement>;
  private appConfig = inject(AppConfigService);
  private common = inject(CommonService);
  private apiService = inject(MemberService);
  private destroyRef = inject(DestroyRef);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);
  proxyUrl = this.appConfig.envUrl;

  gender = Gender;

  lookup$ = forkJoin({
    countryCodes: this.common.getCountryCodes(),
    sources: this.common.getLookup(LookupType.SourceOfKnowledge),
    sales: this.common.getLookup(LookupType.Sales)
  })

  bulkPotentialForm = {} as IBulkPotentialMembersUploadForm;

  public dialogRef = inject(MatDialogRef<UploadBulkMembersComponent>);

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit(form: NgForm) {
    if (form.form.valid) {
      this.apiService.uploadPotentialMembers(this.bulkPotentialForm).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.toastr.success(this.translate.instant('httpResponseMessages.bulkPotentialUpload', { element: res.data }));
          this.dismiss('success')
        },
        error: () => {
          this.fileUpload.nativeElement.value = '';
          // this.bulkPotentialForm.file = null;
          // this.bulkPotentialForm.fileName = null;
        }
      })
    }
  }

  onFileUpload(e: Event) {
    if ((e.target as HTMLInputElement).files?.length) {
      const file = (e.target as HTMLInputElement).files![0];
      const fileType = file.name.split(".");
      if (!fileType.includes('xlsx')) {
        this.toastr.error(this.translate.instant('members.allowedFormats'));
        this.bulkPotentialForm.fileName = null;
        this.bulkPotentialForm.file = null;
      } else {
        this.bulkPotentialForm.fileName = file.name;
        this.bulkPotentialForm.file = file;
      }
    }
  }

}
