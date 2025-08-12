import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { TrainerMemberRetentionReport } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-trainer-member-reten-report-filters',
    imports: [CommonModule, FormsModule, MatInputModule, MatSelectModule, TranslateModule],
    templateUrl: './trainer-member-reten-report-filters.component.html',
    styleUrl: './trainer-member-reten-report-filters.component.scss'
})
export class TrainerMemberRetenReportFiltersComponent {
  @Input() filters: TrainerMemberRetentionReport;
  private commonService = inject(CommonService);
  trainer$ = this.commonService.getLookup(LookupType.Trainers)
}
