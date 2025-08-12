import { Component, Input, OnInit } from '@angular/core';
import { TopActiveMembersReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-top-active-members-report-filters',
    templateUrl: './top-active-members-report-filters.component.html',
    styleUrls: ['./top-active-members-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class TopActiveMembersReportFiltersComponent implements OnInit {

  @Input() filters: TopActiveMembersReportFilter;
  constructor() { }

  ngOnInit(): void {
  }
}
