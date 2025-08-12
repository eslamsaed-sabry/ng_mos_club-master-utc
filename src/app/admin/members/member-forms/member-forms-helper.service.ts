import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { IBranch, ICountryCode } from 'src/app/models/common.model';
import { Gender, GymConfig, LookupType, MemberFormTypes } from 'src/app/models/enums';
import { IPackage, Member, Membership } from 'src/app/models/member.model';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { AppConfigService } from 'src/app/services/app-config.service';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { UserPermissionsService } from 'src/app/services/user-permissions.service';

@Injectable({ providedIn: 'root' })
export class MemberFormsHelperService {
  private destroyRef = inject(DestroyRef);
  appConfig = inject(AppConfigService);
  common = inject(CommonService);
  memberService = inject(MemberService);
  toastr = inject(ToastrService);
  permissions = inject(UserPermissionsService);
  standardDate = inject(StandardDatePipe);

  proxyUrl = this.appConfig.envUrl;
  formType: MemberFormTypes;
  formTypes = MemberFormTypes;
  isFullMember: boolean = true;
  isMembershipOnly: boolean = false;

  member = {} as Member;
  membership = {} as Membership;

  sales: any[] = [];
  doctors: any[] = [];
  branches: any = [];
  levels: any = [];
  goals: any = [];
  sizes: any = [];
  nationalities: any[] = [];
  regions: any[] = [];
  jobTitles: any[] = [];
  sources: any[] = [];
  preferredShift: any[] = [];
  teams: any[] = [];
  coaches: any[] = [];
  gymSections: any[] = [];
  packageTypes: any[] = [];
  countryCodes: ICountryCode[] = [];
  preferredGender: Gender;
  packages: IPackage[] = [];

  isLookupsReady: boolean;

  currentBranch: IBranch = JSON.parse(localStorage.getItem('MOSBranch') || '');

  getMemberFormLookups() {
    if (!this.isLookupsReady)
      forkJoin({
        nationality: this.common.getLookup(LookupType.Nationalities),
        regions: this.common.getLookup(LookupType.Regions),
        // jobTitles: this.common.getLookup(LookupType.JobTitle),
        sources: this.common.getLookup(LookupType.SourceOfKnowledge),
        preferredShift: this.common.getLookup(LookupType.PreferredShift),
        teams: this.common.getLookup(LookupType.Teams),
        sales: this.common.getLookup(LookupType.Sales),
        // branches: this.common.getLookup(LookupType.Branches),
        coaches: this.common.getLookup(LookupType.Trainers),
        levels: this.common.getLookup(LookupType.MemberLevel),
        goals: this.common.getLookup(LookupType.MemberGoals),
        sizes: this.common.getLookup(LookupType.SuitSize),
        gender: this.memberService.getGymConfig(GymConfig.gender)
      }).pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            this.nationalities = res.nationality;
            this.regions = res.regions;
            // this.jobTitles = res.jobTitles;
            this.sources = res.sources;
            this.preferredShift = res.preferredShift;
            this.teams = res.teams;
            // this.branches = res.branches;
            this.levels = res.levels;
            this.sales = res.sales;
            this.goals = res.goals;
            this.sizes = res.sizes;

            if (res.gender.data == '1') {
              this.member.gender = this.preferredGender = Gender.MALE;
            } else if (res.gender.data == '0') {
              this.member.gender = this.preferredGender = Gender.FEMALE;
            }

            this.isLookupsReady = true;
          }
        });
  }

  getSpecificLookup(lookupType: LookupType) {
    return this.common.getLookup(lookupType)
  }


  resetForms() {
    this.member = {} as Member;
    this.membership = {} as Membership;
  }


}
