import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { SearchConfig } from 'src/app/models/common.model';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { IEventBooking } from 'src/app/models/management.model';
import { Member } from 'src/app/models/member.model';
import { ManagementService } from 'src/app/services/management.service';
import { MemberService } from 'src/app/services/member.service';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';

@Component({
  selector: 'app-event-booking-form',
  imports: [MatDialogModule, TranslateModule, MatButtonModule, FormsModule, MatInputModule, MatDatepickerModule,
    AdvancedSearchComponent, MatSelectModule, AsyncPipe
  ],
  templateUrl: './event-booking-form.component.html'
})
export class EventBookingFormComponent {
  event = inject<IEventBooking>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EventBookingFormComponent>);
  private managementService = inject(ManagementService);
  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);

  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  visaTypes$ = this.memberService.getLookup(LookupType.VisaTypes).pipe(map(res => res as any));
  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getSelectedMember(member: Member) {
    this.event.memberId = member.id;
  }

  addBooking(form: NgForm) {
    if (!this.event.memberId) {
      return alert('Please select a member');
    }
    if (form.form.valid) {
      this.event.eventId = this.event.id;
      this.managementService.addEventBooking(this.event).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.dismiss('success')
        }
      })
    }
  }

}
