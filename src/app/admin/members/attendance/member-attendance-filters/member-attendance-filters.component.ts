import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Gender, LookupType } from 'src/app/models/enums';
import { AttendanceFilters } from 'src/app/models/member.model';
import { IAuthorizedUser } from 'src/app/models/user.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { CommonService } from 'src/app/services/common.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-member-attendance-filters',
    templateUrl: './member-attendance-filters.component.html',
    styleUrls: ['./member-attendance-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class MemberAttendanceFiltersComponent implements OnInit {
  @Output() onFilterChange: EventEmitter<any> = new EventEmitter();
  @Input() filters: AttendanceFilters;
  currentLang: string;
  gender = Gender;
  sales: any[] = [];
  users: IAuthorizedUser[] = [];
  constructor(private translate: TranslateService, private commonService: CommonService, private adminService: AdministrationService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getSales();
    this.getUsers();
  }

  getUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }
  getSales() {
    this.commonService.getLookup(LookupType.Sales).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }




}
