import { AsyncPipe, DatePipe, LowerCasePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { IAddVisit, IBenefitSession, ICountryCode, IMemberVisit } from 'src/app/models/common.model';
import { MembershipStatusPipe } from 'src/app/pipes/membership-status.pipe';
import { AppConfigService } from 'src/app/services/app-config.service';
import { BrandService } from 'src/app/services/brand.service';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { ITableColumn, MAT_TABLE_COL_TYPE, MaterialTableComponent } from 'src/app/shared/material-table/material-table.component';

@Component({
  selector: 'app-member-branch-visit',
  imports: [TranslateModule, MatInputModule, MatSelectModule, FormsModule, AsyncPipe, MatButtonModule, MembershipStatusPipe, NgClass, DatePipe, MaterialTableComponent, LowerCasePipe],
  templateUrl: './member-branch-visit.component.html'
})
export class MemberBranchVisitComponent {
  commonService = inject(CommonService);
  brandService = inject(BrandService);
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  private translate = inject(TranslateService);
  private toastr = inject(ToastrService);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);
  branches$ = this.commonService.getBranches().pipe(map(b => b.data));
  getCountryCode$ = this.commonService.getCountryCodes().pipe(map(res => this.countryCodes = res.data));
  countryCodes: ICountryCode[];
  phoneNumber: string; //'01091176341'
  phoneFormatId: number = 1;
  branchId: number;
  displayedCols: ITableColumn[] = [
    { label: this.translate.instant('reports.table.sessionDate'), key: 'sessionDate', colType: MAT_TABLE_COL_TYPE.DATETIME },
    { label: this.translate.instant('reports.table.status'), key: 'approvedStatus' }
  ];

  memberData: IMemberVisit;
  onShowVisits: boolean;
  visits: IAddVisit[];

  submit(form: NgForm) {
    this.onShowVisits = false;
    const _isValid = this.commonService.validatePhoneNumber(this.phoneNumber, this.phoneFormatId, this.countryCodes);
    if (form.form.valid && _isValid) {
      this.getMemberData();
    }
  }

  getMemberData() {
    this.memberService.getMemberBranch(this.phoneNumber, this.branchId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        if (res.data)
          this.memberData = res.data;
        else
          this.toastr.error(this.translate.instant('members.noMemberFoundBranch'))
      }
    })
  }

  showVisits() {
    if (!this.onShowVisits) {
      this.memberService.getBenefitSessions(this.memberData.membershipId, this.memberData.visits.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.onShowVisits = true;
          this.visits = res.data;
        }
      })
    } else {
      this.onShowVisits = false;
    }
  }

  onAddVisit() {
    let obj: IBenefitSession = {
      attendanceDate: new Date(),
      membershipId: this.memberData.membershipId,
      benfitId: this.memberData.visits.id
    }

    this.memberService.addBenefitSession(obj).subscribe({
      next: (res) => {
        this.showVisits();
        this.getMemberData();
      }
    })
  }
}
