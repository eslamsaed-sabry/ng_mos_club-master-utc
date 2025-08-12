import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SearchConfig } from 'src/app/models/common.model';
import { Redirection, Theme } from 'src/app/models/enums';
import { Member, dialogTrainerSlotMember } from 'src/app/models/member.model';
import { SalesScheduleService } from 'src/app/services/sales-schedule.service';
import { MatButtonModule } from '@angular/material/button';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-add-slot-member',
    templateUrl: './add-slot-member.component.html',
    styleUrls: ['./add-slot-member.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, AdvancedSearchComponent, MatDialogActions, MatButtonModule, TranslateModule]
})
export class AddSlotMemberComponent {
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Fixed
  };
  member: Member;
  constructor(public dialogRef: MatDialogRef<AddSlotMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogTrainerSlotMember, private translate: TranslateService, private apiService: SalesScheduleService) { }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  addMember() {
    this.apiService.addSlotMember(this.data.slotData.contextId, this.member.id).subscribe({
      next: (res) => {
        this.dismiss('success')
      }
    })
  }

  getSelectedMember(member: Member) {
    this.member = member;
  }
}
