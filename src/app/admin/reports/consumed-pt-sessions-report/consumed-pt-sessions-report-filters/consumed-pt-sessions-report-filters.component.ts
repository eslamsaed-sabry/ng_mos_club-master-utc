
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { LookupType } from 'src/app/models/enums';
import { ConsumedPTSessionsReportFilter } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-consumed-pt-sessions-report-filters',
    templateUrl: './consumed-pt-sessions-report-filters.component.html',
    styleUrl: './consumed-pt-sessions-report-filters.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class ConsumedPTSessionsReportFiltersComponent implements OnInit {
  @Input() filters: ConsumedPTSessionsReportFilter;
  coaches: any[] = [];
  date: Date = new Date();
  constructor(private commonService: CommonService) { }

  ngOnInit(): void {
    this.getCoach();
  }

  getCoach() {
    this.commonService.getLookup(LookupType.Trainers).subscribe({
      next: (res: any) => {
        this.coaches = res;
      }
    })
  }

}
