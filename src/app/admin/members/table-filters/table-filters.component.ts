import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, inject, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MemberFilters, IPackage } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { Gender, LookupType } from 'src/app/models/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table-filters',
  templateUrl: './table-filters.component.html',
  styleUrls: ['./table-filters.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BidiModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatButtonModule,
    TranslateModule
]
})
export class TableFiltersComponent implements OnInit, AfterViewInit {
  @Output() onFilterChange: EventEmitter<MemberFilters> = new EventEmitter();
  @Input() isMembershipFilters: boolean;
  @Input() isOnePassService: boolean;
  destroyRef = inject(DestroyRef);
  @Input() filters: MemberFilters = new MemberFilters();
  filtersGroup: FormGroup = new FormGroup({
    applicationNo: new FormControl(null),
    code: new FormControl(null),
    name: new FormControl(null),
    phoneNo: new FormControl(null),
    nationalId: new FormControl(null),
    BirthDateFrom: new FormControl<Date | null>(null),
    BirthDateTo: new FormControl<Date | null>(null),
    fromDate: new FormControl<Date | null>(null),
    toDate: new FormControl<Date | null>(null),
    gender: new FormControl(null),
    lastTransferDateFrom: new FormControl<Date | null>(null),
    lastTransferDateTo: new FormControl<Date | null>(null),
    paymentDateFrom: new FormControl<Date | null>(null),
    paymentDateTo: new FormControl<Date | null>(null),
    salesPersonId: new FormControl(null),
    typeId: new FormControl(null),
    packageType: new FormControl(null),
    packageId: new FormControl(null),
    coachId: new FormControl(null),
    status: new FormControl(null),
    photoChangedOnly: new FormControl(null),
    isActive: new FormControl(null),
  });

  currentYear = new Date().getFullYear() - 6;
  maxDate = new Date(this.currentYear, 11, 31);
  sales: any[] = [];
  sessionTypes: any[] = [];
  packages: IPackage[] = [];
  coaches: any[] = [];
  statuses: any[] = [];
  packagesTypes: any[] = [];
  currentLang: string;
  gender = Gender;

  private router = inject(Router);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.filtersGroup.patchValue({
      isActive: true,
      ...this.filters
    })
    this.getSales();
    this.getSessionTypes();
    this.getPackagesTypes();
  }

  applyFilters() {
    let filters: any = {};
    Object.entries(this.filtersGroup.value).forEach(([k, v]) => {
      if (v != null && v.toString().trim().length > 0) {
        filters[k] = k != 'BirthDateFrom' && k != 'BirthDateTo' && k != 'fromDate' && k != 'toDate' && k != 'lastTransferDateFrom' && k != 'lastTransferDateTo' && k != 'paymentDateFrom' && k != 'paymentDateTo' ? v.toString().trim() : v;
      }
    })
    this.onFilterChange.emit(filters);
  }

  ngAfterViewInit(): void {
    if (this.isMembershipFilters) {
      this.getCoaches();
      this.getStatuses();
      this.onSelectPackageType();
    }
  }

  getSales() {
    this.memberService.getLookup(LookupType.Sales, this.filtersGroup.value.isActive).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.sales = res;
      }
    })
  }

  getSessionTypes() {
    this.memberService.getSessionsTypes().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.sessionTypes = res.data;
      },
    });
  }

  getPackagesTypes() {
    this.memberService.getLookup(LookupType.PackageType).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.packagesTypes = res;
      }
    })
  }

  getCoaches() {
    this.memberService.getLookup(LookupType.Trainers).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (res: any) => {
        this.coaches = res
      });
  }

  getStatuses() {
    this.memberService.getLookup(LookupType.MembershipStatus).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (res: any) => {
        this.statuses = res
      });
  }


  onSelectPackageType() {
    this.memberService.getPackages(this.filtersGroup.controls['packageType'].value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.packages = res.data;
      },
    });
  }

  removeParams() {
    this.router.navigate([], {
      queryParams: {
        contextId: null
      },
      queryParamsHandling: 'merge'
    })
  }

  clearAllFilters() {
    this.removeParams();
    this.filtersGroup.reset();
    this.applyFilters();
  }

}
