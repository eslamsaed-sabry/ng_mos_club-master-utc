import { Component, Input, OnInit } from '@angular/core';
import { InvitationCountReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-invitation-count-filters',
    templateUrl: './invitation-count-filters.component.html',
    styleUrls: ['./invitation-count-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class InvitationCountFiltersComponent implements OnInit {

  @Input() filters: InvitationCountReportFilter;
  constructor() { }

  ngOnInit(): void {
  }
}

