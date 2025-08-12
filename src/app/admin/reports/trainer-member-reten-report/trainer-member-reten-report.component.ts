import { Component, inject, viewChild } from '@angular/core';
import { ReportsPageHeaderComponent } from '../reports-page-header/reports-page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrainerMemberRetentionReport, TTrainerMemberGroupedSessions, TTrainerMemberSession } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TrainerMemberRetenReportFiltersComponent } from './trainer-member-reten-report-filters/trainer-member-reten-report-filters.component';
import { DatePipe, NgClass } from '@angular/common';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-trainer-member-reten-report',
    imports: [ReportsPageHeaderComponent, TranslateModule, TrainerMemberRetenReportFiltersComponent, MatExpansionModule, NgClass, DatePipe],
    templateUrl: './trainer-member-reten-report.component.html',
    styleUrl: './trainer-member-reten-report.component.scss'
})
export class TrainerMemberRetenReportComponent {
  accordion = viewChild.required(MatAccordion);
  private reportsService = inject(ReportsService);
  isResult: boolean;
  filters: TrainerMemberRetentionReport = new TrainerMemberRetentionReport();
  sessions: TTrainerMemberSession[];
  groupedSessions: TTrainerMemberGroupedSessions[];
  onPrint = false;
  clear() {
    this.isResult = false;
    this.filters = new TrainerMemberRetentionReport();
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
        this.accordion().openAll();
        this.onPrint = true;
        setTimeout(() => {
          window.print();
          this.onPrint = false;
        }, 1000);
        break;
    }
  }

  generate() {
    this.isResult = false;
    this.reportsService.generateTrainerMemberRetentionReport(this.filters)
      .subscribe({
        next: (res) => {
          this.isResult = true;
          this.sessions = res.data;
          this.groupedSessions = this.sessions.reduce((acc: TTrainerMemberGroupedSessions[], session) => {
            const existingGroup = acc.find(
              group => group.memberId === session.memberId && group.coachId === session.coachId
            );

            if (existingGroup) {
              existingGroup.sessions.push(session);
            } else {
              acc.push({
                memberId: session.memberId,
                coachId: session.coachId,
                memberName: session.memberEnglishName,
                coachName: session.coachName,
                sessions: [session]
              });
            }

            return acc;
          }, []);

          this.groupedSessions.sort((a, b) => b.sessions.length - a.sessions.length);
        },
      });
  }

}
