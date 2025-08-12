import { BidiModule } from '@angular/cdk/bidi';

import { Component, DestroyRef, EventEmitter, inject, Input, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { EmployeeRequestFilters } from 'src/app/models/staff.model';
import { MemberService } from 'src/app/services/member.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
    selector: 'app-employee-request-filters',
    templateUrl: './employee-request-filters.component.html',
    styleUrl: './employee-request-filters.component.scss',
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatOptionModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class EmployeeRequestFiltersComponent {
  @Input() filters: EmployeeRequestFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  currentLang: string;
  employees: any[] = [];
  requestType: any[] = [];

  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  destroyRef = inject(DestroyRef);
  constructor() { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getEmployees();
    this.getRequestType();
  }

  getEmployees() {
    this.memberService.getLookup(LookupType.Staff).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.employees = res;
      }
    })
  }

  getRequestType() {
    this.memberService.getLookup(LookupType.RequestType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.requestType = res;
      }
    })
  }
}
