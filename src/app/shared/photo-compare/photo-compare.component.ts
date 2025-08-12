import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { IMemberPhotoDialog } from 'src/app/models/common.model';
import { CommonService } from 'src/app/services/common.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-photo-compare',
    templateUrl: './photo-compare.component.html',
    styleUrls: ['./photo-compare.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatIconModule, TranslateModule]
})
export class PhotoCompareComponent implements OnInit {
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;

  constructor(public dialogRef: MatDialogRef<PhotoCompareComponent>, @Inject(MAT_DIALOG_DATA) public data: IMemberPhotoDialog,
    private common: CommonService) { }

  ngOnInit(): void {

  }

  decline() {
    this.common.declineMemberPhoto(this.data.memberId).subscribe({
      next: (res) => {
        this.dismiss('success');
      }
    })
  }

  confirm() {
    this.common.confirmMemberPhoto(this.data.memberId).subscribe({
      next: (res) => {
        this.dismiss('success');
      }
    })
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }
}
