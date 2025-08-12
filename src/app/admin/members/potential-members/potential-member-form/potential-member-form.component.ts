import { Component, OnInit, Inject, inject, DestroyRef } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, forkJoin, Subject } from 'rxjs';
import { ICountryCode, ILookUp, SearchConfig } from 'src/app/models/common.model';
import { Gender, GymConfig, LookupType, PageNames, Redirection, Theme } from 'src/app/models/enums';
import { dialogPossibleMemberData, IPossibleMember, Member } from 'src/app/models/member.model';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatOptionModule } from '@angular/material/core';

import { MatSelectModule } from '@angular/material/select';
import { RoleDirective } from '../../../../directives/role.directive';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-potential-member-form',
    templateUrl: './potential-member-form.component.html',
    styleUrls: ['./potential-member-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, RoleDirective, MatSelectModule, MatOptionModule, MatProgressSpinnerModule, MatIconModule, MatTooltipModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule, AdvancedSearchComponent],
    providers: [MemberService]
})
export class PotentialMemberFormComponent implements OnInit {
  member: IPossibleMember = {} as IPossibleMember;
  sales: any[] = [];
  sources: ILookUp[] = [];
  gender = Gender;
  isNotValid: boolean;
  phoneTypeAheadLoading: boolean;
  idTypeAheadLoading: boolean;
  showPhoneTypeAheadList: boolean;
  showIDTypeAheadList: boolean;
  memberSub = new Subject<any>();
  members: any[] = [];
  requiredFields: string[] = [];
  countryCodes: ICountryCode[] = [];
  gymConfig = GymConfig;
  showSearch: boolean;

  private memberService = inject(MemberService);
  private toastr = inject(ToastrService);
  public common = inject(CommonService);
  private standardDate = inject(StandardDatePipe);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  config: SearchConfig = {
    placeholder: this.translate.instant('common.selectedReferral'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Page
  };

  constructor(public dialogRef: MatDialogRef<PotentialMemberFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogPossibleMemberData) { }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  ngOnInit(): void {
    this.getLookups();
    if (this.data.type === 'editMember') {
      this.member = { ...this.data.memberData } as IPossibleMember;
      if (this.data.memberData.referralMemberId) {
        this.showSearch = true
      }
    } else {
      this.member.phoneFormatId = 1;
    }

    if (!this.member.joiningDate) {
      this.member.joiningDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
    else {
      this.member.joiningDate = moment(this.member.joiningDate).format('YYYY-MM-DD') + 'T' + moment(this.member.joiningDate).format('HH:mm');
    }

    if (!this.data.memberData) {
      this.data.memberData = {} as IPossibleMember;
    }

    this.memberSub.pipe(debounceTime(700)).subscribe((res) => {
      if (res.fieldName === 'phone') {
        this.getMembers({ phoneNo: this.member.phoneNo }, 'phone');
      }
    });
  }

  getLookups() {
    forkJoin({
      requiredFields: this.memberService.getRequiredFields(PageNames.POTENTIAL_MEMBER),
      sources: this.common.getLookup(LookupType.SourceOfKnowledge),
      sales: this.common.getLookup(LookupType.Sales),
      gender: this.memberService.getGymConfig(GymConfig.gender),
      countryCodes: this.common.getCountryCodes()
    }).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.sources = res.sources;
          this.sales = res.sales;
          this.requiredFields = res.requiredFields.map((el: any) => el.fieldDevName.charAt(0).toLowerCase() + el.fieldDevName.slice(1));
          this.countryCodes = res.countryCodes.data;
          if (res.gender.data == '1') {
            this.member.gender = Gender.MALE;
          } else if (res.gender.data == '0') {
            this.member.gender = Gender.FEMALE;
          }

        }
      });
  }

  onSelectSource() {
    const _selectedSrc = this.sources.find(s => s.id === this.member.sourceOfKnowledgeId);
    if (_selectedSrc?.isReferral) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
      delete this.member.referralMemberId;
    }
  }

  getSelectedMember(referral: Member) {
    this.member.referralMemberId = referral.id;
  }

  validateNationalID() {
    if (this.member.nationalId.length !== 14) {
      this.isNotValid = true;
      this.toastr.error('Invalid national ID, should be 14 characters');
    } else {
      let arr = this.member.nationalId.split("");
      this.member.birthDate = new Date(arr[3] + arr[4] + '-' + arr[5] + arr[6] + '-' + arr[1] + arr[2]);
      this.member.birthDate = this.standardDate.transform(this.member.birthDate);
    }
  }

  submit(f: NgForm) {
    const _member = { ...this.member }
    if (this.showSearch && !_member.referralMemberId) {
      this.toastr.error(this.translate.instant('common.referralRequired'));
      return
    }
    if (this.common.validatePhoneNumber(_member.phoneNo, _member.phoneFormatId, this.countryCodes)) {
      _member.isPossibleMember = true;
      if (f.form.status === 'VALID') {
        if (this.data.type === 'editMember') {
          this.memberService.editPotentialMember(_member).subscribe({
            next: (res) => {
              this.dismiss('success');
            },
          });
        } else {
          this.memberService.addMember(_member).subscribe({
            next: (res) => {
              const _new = { ..._member, id: res.data }
              this.dismiss('success', _new);
            },
          });
        }
      }
    }
  }

  searchAhead(fieldName: string) {
    switch (fieldName) {
      case 'phone':
        if (this.member.phoneNo.trim().length > 0) {
          this.phoneTypeAheadLoading = true;
          this.getFilters({ phoneNo: this.member.phoneNo, fieldName: fieldName })
        }
        break;
      case 'nationalID':
        if (this.member.nationalId.trim().length > 0) {
          this.idTypeAheadLoading = true;
          this.getFilters({ nationalId: this.member.nationalId, fieldName: fieldName })
        }
        break;
    }
  }



  getFilters(params: any) {
    this.memberSub.next(params);
  }

  getMembers(params: any, fieldName: string) {
    let props = {
      ...params,
      skipCount: 0,
      takeCount: 10,
      showSuccessToastr: 'false',
      showSpinner: 'false'
    };

    this.memberService.getMembers(props).pipe(debounceTime(700))
      .subscribe({
        next: (res: any) => {
          this.members = res.data;
          this.phoneTypeAheadLoading = false;
          this.idTypeAheadLoading = false;
          if (this.members.length > 0) {
            if (fieldName === 'phone')
              this.showPhoneTypeAheadList = true;
            if (fieldName === 'nationalID')
              this.showIDTypeAheadList = true;
          }
        },
      });
  }

  onSelectMember(m: IPossibleMember) {
    this.member = m;
    this.showPhoneTypeAheadList = false;
    this.showIDTypeAheadList = false;
  }

  toggleHighPotential(member: IPossibleMember) {
    member.isHighPotential = !member.isHighPotential;
  }


}
