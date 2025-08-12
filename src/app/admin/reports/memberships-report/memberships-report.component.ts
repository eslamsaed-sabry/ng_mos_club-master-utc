import { Component, OnInit, OnDestroy } from '@angular/core';
import { Membership } from 'src/app/models/member.model';
import { MembershipsLogReportFilter, MembershipsReportFilter, NewNotRenewedMembershipsReportFilter } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ReportsService } from 'src/app/services/reports.service';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MembershipsReportFiltersComponent } from './memberships-report-filters/memberships-report-filters.component';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';

@Component({
    selector: 'app-memberships-report',
    templateUrl: './memberships-report.component.html',
    styleUrls: ['./memberships-report.component.scss'],
    imports: [ReportsPageHeaderComponent, MembershipsReportFiltersComponent, MatButtonModule, RouterLink, MatIconModule, DecimalPipe, DatePipe, TranslateModule, GenderPipe]
})
export class MembershipsReportComponent implements OnInit, OnDestroy {
  isResult: boolean;
  filters: MembershipsReportFilter | NewNotRenewedMembershipsReportFilter | MembershipsLogReportFilter;
  memberships: Membership[];
  membershipsNotRenewed: any[];
  newMemberships: any[] = [];
  renewMemberships: any[] = [];
  membershipsLog: any[] = [];
  private destroy$ = new Subject();
  reportName: string;
  dataType: string;
  permissions: string[] = [];
  constructor(private memberService: MemberService, private route: ActivatedRoute, private translate: TranslateService,
    private reportsService: ReportsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.dataType = params['type'];
      this.getPermissions();
      this.clear();
    })
  }

  getPermissions() {
    switch (this.dataType) {
      case 'privateMemberships':
        this.permissions = ['privateMembershipsReport', 'tsb_Print', 'Export'];
        break;
      case 'newRenewed':
        this.permissions = ['newRenewMemReport', 'tsb_Print', 'Export'];
        break;
      case 'notRenewed':
        this.permissions = ['notRenewMemReport', 'tsb_Print', 'Export'];
        break;
      case 'log':
        this.permissions = ['memLogReport', 'tsb_Print', 'Export'];
        break;
      case 'all':
        this.permissions = ['membershipsReport', 'tsb_Print', 'Export'];
        break;
    }
  }

  generate() {
    this.isResult = false;
    switch (this.dataType) {
      case 'privateMemberships':
        this.memberService.getPrivateMemberships(<MembershipsReportFilter>this.filters).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
            this.isResult = true;
            this.memberships = res.data;
          },
        });
        break;
      case 'notRenewed':
        this.reportsService.generateNotRenewedMembershipsReport(<NewNotRenewedMembershipsReportFilter>this.filters)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              this.isResult = true;
              this.membershipsNotRenewed = res.data;
            },
          });
        break;
      case 'newRenewed':
        this.reportsService.generateNewRenewedMembershipsReport(<NewNotRenewedMembershipsReportFilter>this.filters)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              this.isResult = true;
              this.newMemberships = res.data.newMemberships;
              this.renewMemberships = res.data.renewMemberships;
            },
          });
        break;
      case 'log':
        this.reportsService.generateMembershipsLogReport(<MembershipsLogReportFilter>this.filters)
          .pipe(takeUntil(this.destroy$)).subscribe({
            next: (res) => {
              this.isResult = true;
              this.membershipsLog = res.data;
            },
          });
        break;

      default:
        this.reportsService.getMemberships(this.filters).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
            this.isResult = true;
            this.memberships = res.data;
          },
        });
        break;
    }
  }

  clear() {
    this.isResult = false;
    switch (this.dataType) {
      case 'privateMemberships':
        this.filters = new NewNotRenewedMembershipsReportFilter();
        this.reportName = this.translate.instant('reports.personalTrainingRep');
        break;
      case 'notRenewed':
        this.filters = new NewNotRenewedMembershipsReportFilter();
        this.reportName = this.translate.instant('reports.notRenewedMembershipsRep');
        break;
      case 'newRenewed':
        this.filters = new NewNotRenewedMembershipsReportFilter();
        this.reportName = this.translate.instant('reports.newRenewedMembershipsRep');
        break;
      case 'log':
        this.filters = new MembershipsLogReportFilter();
        this.reportName = this.translate.instant('reports.membershipsLogRep');
        break;
      default:
        this.filters = new MembershipsReportFilter();
        this.reportName = this.translate.instant('reports.membershipsRep');
        break;
    }
  }

  getAction(actionName: string) {
    switch (actionName) {
      case 'generate':
        this.generate();
        break;
      case 'clear':
        this.isResult = false;
        this.clear();
        break;
      default:
        window.print();
        break;
    }
  }

  calcTotal(array: any[], col: string): number {
    let result: number = 0;
    array!.forEach((el) => {
      result += el[col]
    });
    return result;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null); // trigger the unsubscribe
    this.destroy$.complete(); // finalize & clean up the subject stream
  }

}
