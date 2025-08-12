import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ICountryCode } from 'src/app/models/common.model';
import { customEmojis, Gender, LookupType, MemberGroup, PackageTypes } from 'src/app/models/enums';
import { MemberService } from 'src/app/services/member.service';
import { Subject, forkJoin, fromEvent, takeUntil } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { IPackage, Member } from 'src/app/models/member.model';
import { AddMemberNotification, DebtorsFilter, MatchedMemberNotification, NotActiveMemberFilter, NotRenewedFilter } from 'src/app/models/reports.model';
import { NgForm, FormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import moment from 'moment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
@Component({
    selector: 'app-setup-member-notification',
    templateUrl: './setup-member-notification.component.html',
    styleUrls: ['./setup-member-notification.component.scss'],
    imports: [FormsModule, MatButtonModule, MatExpansionModule, MatRadioModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDatepickerModule, MatIconModule, TranslateModule]
})
export class SetupMemberNotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  filters: MatchedMemberNotification = new MatchedMemberNotification();
  notRenewedFilters: NotRenewedFilter = new NotRenewedFilter();
  willExpireFilters: NotRenewedFilter = new NotRenewedFilter();
  debtorsFilters: DebtorsFilter = new DebtorsFilter();
  notActiveFilters: NotActiveMemberFilter = new NotActiveMemberFilter();
  members: Member[] = [];
  gender = Gender;
  sources: any[] = [];
  countryCodes: ICountryCode[] = [];
  sales: any[] = [];
  nationalities: any[] = [];
  regions: any[] = [];
  packages: IPackage[] = [];
  statuses: any[] = [];
  filterGroup = MemberGroup;
  totalElements: number = 0;
  totalMembers: number = 0;
  page: number = 0;
  pageSize: number = 10;
  valueIsChanged: boolean;
  memberNotification = new AddMemberNotification();
  excludedIds: number[] = [];
  yesterday = moment().subtract(1, 'days');
  tomorrow = moment().add(1, 'days');
  today = new Date();
  showEmojiList: boolean;
  packageTypesEnum = PackageTypes;
  // message: string;
  constructor(private memberService: MemberService, private common: CommonService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    fromEvent(document, 'click')
      .subscribe(() => {
        this.showEmojiList = false;
      });
    this.callLookups();
    this.getCountryCodes();
    this.getPackages();
    this.getStatuses();
  }

  getMonthAgo(date?: Date) {
    if (date) {
      return moment(date).subtract(1, 'days');
    } else {
      return moment().subtract(2, 'days');
    }
  }

  getPackages() {
    this.memberService.getPackages(1).subscribe({
      next: (res) => {
        this.packages = res.data;
      },
    });
  }


  onSelectPackageType(categoryId: number) {
    if (categoryId < 0) categoryId = 0;
    this.memberService.getPackages(categoryId).subscribe({
      next: (res) => {
        this.packages = res.data;
      },
    });
  }

  getStatuses() {
    this.memberService.getLookup(LookupType.MembershipStatus).subscribe(
      (res: any) => {
        this.statuses = res
      });
  }

  callLookups() {
    return forkJoin({
      nationality: this.getLookups('nationality'),
      regions: this.getLookups('regions'),
      sales: this.getLookups('sales'),
      sources: this.getLookups('sources'),
    })
      .subscribe((res: any) => {
        this.nationalities = res.nationality;
        this.regions = res.regions;
        this.sales = res.sales;
        this.sources = res.sources;
      });
  }

  getCountryCodes() {
    this.common.getCountryCodes().subscribe({
      next: (res) => {
        this.countryCodes = res.data;
      }
    })
  }

  getLookups(lookupName: string): any {
    switch (lookupName) {
      case 'nationality':
        return this.memberService.getLookup(LookupType.Nationalities);
      case 'regions':
        return this.memberService.getLookup(LookupType.Regions);
      case 'sales':
        return this.memberService.getLookup(LookupType.Sales);
      case 'jobTitles':
        return this.memberService.getLookup(LookupType.JobTitle);
      case 'sources':
        return this.memberService.getLookup(LookupType.SourceOfKnowledge);
      case 'coaches':
        return this.memberService.getLookup(LookupType.Trainers);
      case 'gymSections':
        return this.memberService.getLookup(
          LookupType.TreasuryTransactionTypes
        );
    }
  }

  resetList() {
    this.valueIsChanged = true;
    this.members = [];
    this.totalMembers = 0;
    this.totalElements = 0;
    this.page = 0;
    this.excludedIds = [];
  }

  getGroup(e: any) {
    this.resetList();
    this.filters.memberGroup = e.value;
    switch (e.value) {
      case MemberGroup.NotRenewed:
        this.filters.additionalFilters = this.notRenewedFilters
        break;
      case MemberGroup.WillExpire:
        this.filters.additionalFilters = this.willExpireFilters
        break;
      case MemberGroup.Debtors:
        this.filters.additionalFilters = this.debtorsFilters
        break;
      case MemberGroup.NotActive:
        this.filters.additionalFilters = this.notActiveFilters
        break;
      default:
        this.filters.additionalFilters = null;
        break;
    }
  }

  afterExpand(e: MemberGroup) {
    this.getGroup({ value: e })
  }

  onPagination() {
    this.page = this.page + 1;
    this.applyFilters();
  }

  applyFilters(form?: NgForm) {
    if (form?.form.status === 'VALID') {
      if (form) {
        form.valueChanges?.subscribe((res) => {
          this.resetList();
        });
      }
      this.filters.skipCount = this.page;
      this.filters.takeCount = this.pageSize;
      this.common.getMatchedMembers(this.filters).subscribe({
        next: (res) => {
          this.members = [...this.members, ...res.data];
          this.totalElements = res.totalCount;
          this.totalMembers = res.totalCount;
        }
      })
    }
  }

  onCheckMember(e: MatCheckboxChange) {
    if (!e.checked) {
      this.excludedIds.push(+e.source.value);
    } else {
      this.excludedIds = this.excludedIds.filter(id => id != +e.source.value);
    }
    this.totalMembers = this.totalElements - this.excludedIds.length
  }

  addNotification(form: NgForm) {

    this.memberNotification.additionalFilters = this.filters.additionalFilters;
    this.memberNotification.memberGetCommand = this.filters.memberGetCommand;
    this.memberNotification.memberGroup = this.filters.memberGroup;
    this.memberNotification.excludedMembersIds = this.excludedIds;

    if (!this.memberNotification.isSMS && !this.memberNotification.isMobileApp && !this.memberNotification.isWhatsApp) {
      this.toastr.error('You should choose a notification type.');
      return
    }

    if (form.form.status === 'VALID') {
      this.common.addMemberNotifications(this.memberNotification).subscribe({
        next: (res) => {
          this.router.navigate(['/admin/management/member-notifications']);
        }
      })
    }
  }

  // onPasteText() {
  //   setTimeout(() => {
  //     this.memberNotification.message = this.memberNotification.message.replace(
  //       /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
  //       ' '
  //     ).replace(/\s+/g, ' ').trim();
  //   }, 200);
  // }

  custom = customEmojis

  addEmoji(e: any) {
    this.memberNotification.message = this.memberNotification.message ? this.memberNotification.message + e.emoji.text : e.emoji.text;
    // this.message = this.message ? this.message + e.emoji.native : e.emoji.native;
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
          this.memberService
            .uploadMemberPic(uploadData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (res: any) => {
                this.memberNotification.imageName = res.data[0];
              },
              error: (error) => {
                this.toastr.error('Error', error.statusText);
                e.target.value = null;
              },
            });
        } else {
          e.target.value = null;
          this.toastr.error(
            'Image size is too big',
            'Sorry! image size exceeds 1mb'
          );
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

}
