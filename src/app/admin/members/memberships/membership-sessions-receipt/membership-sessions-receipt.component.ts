import { Component, Input, inject } from '@angular/core';
import { ISessionPrint } from 'src/app/models/member.model';
import * as env from '../../../../../environments/environment';
import { MemberService } from 'src/app/services/member.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { BrandService } from 'src/app/services/brand.service';

@Component({
    selector: 'app-membership-sessions-receipt',
    templateUrl: './membership-sessions-receipt.component.html',
    styleUrls: ['./membership-sessions-receipt.component.scss'],
    imports: [DatePipe, TranslateModule]
})
export class MembershipSessionsReceiptComponent {
  sessionPrint: ISessionPrint;
  brandService = inject(BrandService);
  logo = env.environment.server + this.brandService.brand.reportLogo;

  memberService = inject(MemberService);
  toastr = inject(ToastrService);

  printSessions(membershipId: number) {
    this.memberService.getPrintableSessions(membershipId).subscribe({
      next: (res) => {
        if (res.data.membership.attendanceCount) {
          this.sessionPrint = res.data;
          document.body.id = "session-receipt-print";
          setTimeout(() => {
            window.print();
          }, 500);
        } else {
          this.toastr.error('Sorry! there is no sessions to print.')
        }
      }
    })
  }

}
