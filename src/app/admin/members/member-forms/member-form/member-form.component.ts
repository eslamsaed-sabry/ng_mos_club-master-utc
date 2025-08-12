import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MemberFormsHelperService } from '../member-forms-helper.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { CameraComponent } from 'src/app/shared/camera/camera.component';
import { WebcamImage } from 'ngx-webcam';
import { Member } from 'src/app/models/member.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchConfig } from 'src/app/models/common.model';
import { EMPTY, Subject, debounceTime, fromEvent, switchMap } from 'rxjs';
import { Gender, GymConfig, PageNames, Redirection, Theme } from 'src/app/models/enums';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AdvancedSearchComponent } from 'src/app/shared/advanced-search/advanced-search.component';
import { FormStepperComponent } from '../form-stepper/form-stepper.component';
import { PermissionsPipe } from 'src/app/pipes/permissions.pipe';

interface ITypeAhead {
  obj: any,
  field: string
}

@Component({
  selector: 'app-member-form',
  imports: [
    RouterModule,
    TranslateModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinner,
    CameraComponent,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    AdvancedSearchComponent,
    FormStepperComponent
],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss'
})
export class MemberFormComponent implements OnInit {
  public _helper = inject(MemberFormsHelperService);
  webcamImage: WebcamImage | undefined;
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translate = inject(TranslateService);
  backUrl = this.route.snapshot.queryParams['backTo'];

  cameraConfig = {
    width: 263,
    height: 263
  };
  config: SearchConfig = {
    placeholder: this.translate.instant('common.selectedReferral'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Page
  };
  permissionPipe = inject(PermissionsPipe);
  phoneTypeAheadLoading: boolean;
  appNoTypeAheadLoading: boolean;
  codeTypeAheadLoading: boolean;
  idTypeAheadLoading: boolean;
  showPhoneTypeAheadList: boolean;
  showAppTypeAheadList: boolean;
  showCodeTypeAheadList: boolean;
  showIDTypeAheadList: boolean;
  isPotentialMemberChosen: boolean;
  isArabic = /[\u0600-\u06FF\u0750-\u077F]/;
  gender = Gender;
  requiredFields: string[] = [];
  members: Member[] = [];
  currentYear = new Date().getFullYear() - 6;
  maxDate = new Date(this.currentYear, 11, 31);
  showSearch: boolean;
  searchOnTyping$ = new Subject<ITypeAhead>();

  ngOnInit(): void {
    if (this._helper.member.referralMemberId) {
      this.showSearch = true;
    }
    this.searchOnTyping$.pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef)).subscribe((res: ITypeAhead) => {
      this.getSuggestedMembers(res.obj, res.field);
    });
    fromEvent(document, 'click').pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showPhoneTypeAheadList = false;
        this.showAppTypeAheadList = false;
        this.showCodeTypeAheadList = false;
        this.showIDTypeAheadList = false;
      });
    this._helper.getMemberFormLookups();
    this.getCountryCodes();
    this.route.params.subscribe((params) => {
      if (this._helper.formType === this._helper.formTypes.ADD_MEMBER) {
        this._helper.member.phoneFormatId = 1;
        this._helper.member.gender = this._helper.preferredGender;
        this._helper.member.mainBranchId = this._helper.currentBranch.id;
        this.getConfigs();
      }
    })

    this.getRequiredFields();
  }


  getCountryCodes() {
    if (!this._helper.isLookupsReady)
      this._helper.common.getCountryCodes().subscribe({
        next: (res) => {
          this._helper.countryCodes = res.data;
        }
      })
  }


  getSuggestedMembers(params: any, fieldName: string) {
    let props = {
      ...params,
      skipCount: 0,
      takeCount: 10,
      showSuccessToastr: 'false',
      showSpinner: 'false'
    };

    this._helper.memberService.getSuggestedMember(props).subscribe({
      next: (res: any) => {
        this.members = res.data;
        if (this._helper.formType === this._helper.formTypes.EDIT_MEMBER) this.members = this.members.filter(el => el.id !== this._helper.member.id)

        this.phoneTypeAheadLoading = false;
        this.appNoTypeAheadLoading = false;
        this.codeTypeAheadLoading = false;
        this.idTypeAheadLoading = false;
        if (this.members.length > 0) {
          if (fieldName === 'phone')
            this.showPhoneTypeAheadList = true;
          if (fieldName === 'contractNo')
            this.showAppTypeAheadList = true;
          if (fieldName === 'accessCode')
            this.showCodeTypeAheadList = true;
          if (fieldName === 'nationalID')
            this.showIDTypeAheadList = true;
        }
      },
    });
  }

  searchAhead(fieldName: string) {
    let _typeAhead = {} as ITypeAhead;
    switch (fieldName) {
      case 'phone':
        if (this._helper.formType != this._helper.formTypes.EDIT_MEMBER && this._helper.member.phoneNo && this._helper.member.phoneNo.trim().length > 0) {
          this.phoneTypeAheadLoading = true;
          this.isPotentialMemberChosen = false;
          _typeAhead = { obj: { phoneNo: this._helper.member.phoneNo }, field: fieldName }
        }
        break;
      case 'contractNo':
        if (this._helper.member.applicationNo && this._helper.member.applicationNo.trim().length > 0) {
          this.appNoTypeAheadLoading = true;
          _typeAhead = { obj: { applicationNo: this._helper.member.applicationNo }, field: fieldName }
        }
        break;
      case 'accessCode':
        if (this.isArabic.test(this._helper.member.code)) {
          this._helper.member.code = '';
          return
        }
        if (this._helper.member.code && this._helper.member.code.trim().length > 0) {
          this.codeTypeAheadLoading = true;
          _typeAhead = { obj: { code: this._helper.member.code }, field: fieldName }
        }
        break;
      case 'nationalID':
        if (this._helper.member.nationalId && this._helper.member.nationalId.trim().length > 0) {
          this.idTypeAheadLoading = true;
          _typeAhead = { obj: { nationalId: this._helper.member.nationalId }, field: fieldName }
        }
        break;
    }
    this.searchOnTyping$.next(_typeAhead);
  }

  upload(e: any) {
    let elem = e.target || e.srcElement;
    if (elem.files.length > 0) {
      let file = elem.files[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        // File types supported for image
        if (file.size < 1000000) {
          const uploadData = new FormData();
          uploadData.append('Files', file);
          this._helper.memberService
            .uploadMemberPic(uploadData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (res: any) => {
                // this.helperService.member.photoFullPath =
                //   environment.server + '/images/' + res[0];
                this.webcamImage = undefined;
                this._helper.member.currentPhotoName = res.data[0];
                this._helper.member.photo = res.data[0];
                this._helper.member.isPhotoCaptured = false;
                this._helper.member.imageBase64 = null;
              },
              error: (error) => {
                this._helper.toastr.error('Error', error.statusText);
                e.target.value = null;
              },
            });
        } else {
          e.target.value = null;
          this._helper.toastr.error(
            'Image size is too big',
            'Sorry! image size exceeds 1mb'
          );
        }
      }
    }
  }
  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
    this._helper.member.isPhotoCaptured = true;
    this._helper.member.imageBase64 = webcamImage.imageAsDataUrl;
  }

  onSelectMember(m: Member) {
    if (!m.isPossibleMember) {
      this._helper.toastr.error("This is already a member, you can't add 2 members with the same phone number.")
      return
    } else {
      this._helper.member = { ...this._helper.member, ...Object.fromEntries(Object.entries(m).filter(([_, v]) => v != null)) as any };
      this.showPhoneTypeAheadList = false;
      this.showAppTypeAheadList = false;
      this.showCodeTypeAheadList = false;
      this.showIDTypeAheadList = false;
      this.isPotentialMemberChosen = true;
      this.onSelectSales();
      this.isSalesDisabled();
    }
  }

  onSelectSales() {
    if (this._helper.member.salesPersonId) {
      this._helper.membership.salesPersonId = this._helper.member.salesPersonId;
    }
  }

  isSalesDisabled(): boolean {
    if (!this._helper.member.salesPersonId) {
      if (!this._helper.permissions.entitiesList.profile.includes('EditSalesPerson') && this._helper.formType != this._helper.formTypes.ADD_MEMBER)
        return true;
      else
        return false;
    } else if (this._helper.member.salesPersonId) {
      if (this._helper.permissions.entitiesList.profile.includes('EditSalesPerson') || !this.isPotentialMemberChosen)
        return false;
      else
        return true;
    }
    return true
  }

  getRequiredFields() {
    this._helper.memberService.getRequiredFields(PageNames.MEMBER_FORM).subscribe({
      next: (res: any) => {
        this.requiredFields = res.map((el: any) => el.fieldDevName.charAt(0).toLowerCase() + el.fieldDevName.slice(1));
      }
    })
  }

  copyName() {
    if (this._helper.formType === this._helper.formTypes.ADD_MEMBER) {
      this._helper.member.nameAR = this._helper.member.nameEng;
    }
  }

  validate(type: string) {
    switch (type) {
      case 'nationalID':
        if (this._helper.member.nationalId.length !== 14) {
          this._helper.toastr.error('Invalid national ID, should be 14 characters');
        } else {
          let arr = this._helper.member.nationalId.split("");
          this._helper.member.birthDate = new Date(arr[3] + arr[4] + '-' + arr[5] + arr[6] + '-' + arr[1] + arr[2]);
          this._helper.member.birthDate = this._helper.standardDate.transform(this._helper.member.birthDate);
        }
        break;

      default:
        break;
    }
  }

  onSelectSrc() {
    const _selectedSrc = this._helper.sources.find(s => s.id === this._helper.member.sourceOfKnowledgeId);
    if (_selectedSrc?.isReferral) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
      delete this._helper.member.referralMemberId;
    }
  }

  onSelectPreferredShift() {
    const _selectedPreferredShift = this._helper.preferredShift.find(s => s.id === this._helper.member.preferredShiftId);
    if (_selectedPreferredShift?.isReferral) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
      delete this._helper.member.referralMemberId;
    }
  }

  getSelectedMember(referral: Member) {
    this._helper.member.referralMemberId = referral.id;
  }


  setBranchName() {
    this._helper.member.mainBranchName = this._helper.branches.find((b: any) => b.id === this._helper.member.mainBranchId).name;
  }

  getConfigs() {
    this._helper.memberService.getGymConfig(GymConfig.contractNo).pipe(takeUntilDestroyed(this.destroyRef),
      switchMap((data) => {
        if (data.data == '1') {
          return this._helper.memberService.getNextContractNo();
        } else {
          return EMPTY
        }
      })
    ).subscribe({
      next: (res) => {
        if (res && res.data) {
          this._helper.member.applicationNo = res.data;
          this._helper.member.code = res.data;
        }
      }
    });
  }

  addMember() {
    this._helper.memberService.addMember(this._helper.member)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this._helper.resetForms();
          this.router.navigate(['/admin/member-profile', res.data]);
        },
      });
  }


  submit(f: NgForm) {
    if (this.showSearch && !this._helper.member.referralMemberId) {
      this._helper.toastr.error(this.translate.instant('common.referralRequired'));
      return
    }

    if (this._helper.common.validatePhoneNumber(this._helper.member.phoneNo, this._helper.member.phoneFormatId, this._helper.countryCodes)) {
      if (f.form.status === 'VALID') {
        this._helper.member.joiningDate = new Date();
        if (this._helper.formType === this._helper.formTypes.ADD_MEMBER) {
          if (this._helper.isFullMember) {
            this.router.navigate(['/admin/form/membership/add']);
          } else {
            this.addMember();
          }
        } else {
          this._helper.memberService.editMember(this._helper.member)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: (res) => {
                if (this.backUrl === 'list') {
                  this.router.navigate(['/admin/members']);
                } else {
                  this.router.navigate(['/admin/member-profile', this._helper.member.id]);
                }
                this._helper.resetForms();
              },
            });
        }

      }
    }

  }


  onIsOutsider() {
    if (!this._helper.member.isOutsider) {
      this.requiredFields = [...this.requiredFields, 'applicationNo', 'code'];
      this.getConfigs();
    } else {
      this.requiredFields = this.requiredFields.filter(el => el !== 'applicationNo' && el !== 'code');
      this._helper.member.applicationNo = '';
      this._helper.member.code = '';
    }
  }


}
