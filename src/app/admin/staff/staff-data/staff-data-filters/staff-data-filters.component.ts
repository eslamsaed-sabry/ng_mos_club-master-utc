import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { IStaffJob, StaffFilters } from 'src/app/models/staff.model';
import { StaffService } from 'src/app/services/staff.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-staff-data-filters',
    templateUrl: './staff-data-filters.component.html',
    styleUrls: ['./staff-data-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class StaffDataFiltersComponent implements OnInit {
  @Input() filters: StaffFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  jobTitles: IStaffJob[] = [];


  constructor(private staffService: StaffService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getJobTitles();
  }

  getJobTitles() {
    this.staffService.getJobTitles().subscribe({
      next: (res) => {
        this.jobTitles = res.data;
      }
    })
  }
}
