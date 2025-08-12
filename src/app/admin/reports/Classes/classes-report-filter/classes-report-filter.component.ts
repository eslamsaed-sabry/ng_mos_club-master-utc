import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ClassAttendanceStatus, ClassesReports, InstructorDueAmountBasedOn, LookupType } from 'src/app/models/enums';
import { ClassesReportFilters } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';
import { UserPermissionsService } from 'src/app/services/user-permissions.service';
import { IBranch } from 'src/app/models/common.model';
import { BrandService } from 'src/app/services/brand.service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-classes-report-filter',
  templateUrl: './classes-report-filter.component.html',
  styleUrls: ['./classes-report-filter.component.scss'],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule, MatRadioModule]
})
export class ClassesReportFilterComponent implements OnInit {

  @Input() filters: Partial<ClassesReportFilters>;
  @Input() nameOfReport: ClassesReports;
  @Output() basedOnChange: EventEmitter<any> = new EventEmitter();
  private commonService = inject(CommonService);
  public permissions = inject(UserPermissionsService);
  private brandService = inject(BrandService);
  byFromDate: boolean = false;
  byToDate: boolean = false;
  byInstructorId: boolean = false;
  byStatusId: boolean = false;
  byClassNameId: boolean = false;
  byBranchId: boolean = true;
  byBasedOn: boolean = false;
  instructorDueAmountBasedOn = InstructorDueAmountBasedOn;

  instructorIdIsRequired: boolean = false;

  instructors: any[] = [];
  classesTypes: any[] = [];
  branches: IBranch[] = [];
  AttendanceStatusList = ClassAttendanceStatus;


  ngOnInit(): void {
    this.getFilter();
    this.getInstructors();
    this.getBranches();

  }

  getInstructors() {
    this.commonService.getLookup(LookupType.Instructors).subscribe({
      next: (res: any) => {
        this.instructors = res;
      }
    })
  }

  getClassesTypes() {
    this.commonService.getLookup(LookupType.ClassesTypes).subscribe({
      next: (res: any) => {
        this.classesTypes = res;
      }
    })
  }

  getBranches() {
    this.branches = this.brandService.branches;
  }

  getFilter() {
    switch (this.nameOfReport) {
      case ClassesReports.CLASSES_TYPES_REPORT:
      case ClassesReports.CANCELED_CLASSES_REPORT:
      case ClassesReports.MEMBER_RESERVATIONS_ON_CLASSES_REPORT:
      case ClassesReports.GYM_ATTENDACE_COUNT:
        this.byFromDate = true;
        this.byToDate = true;
        break;
      case ClassesReports.HELD_CLASSES_REPORT:
        this.byFromDate = true;
        this.byToDate = true;
        this.byBranchId = true;
        if (this.permissions.hasPermissions(['heldClassesReport', 'ShowAllData']))
          this.byInstructorId = true;

        break;
      case ClassesReports.INSTRUCTOR_DUE_AMOUNT:
        this.byFromDate = true;
        this.byToDate = true;
        this.byBasedOn = true;
        if (this.permissions.hasPermissions(['instructorDueAmountReport', 'ShowAllData'])) {
          this.byInstructorId = true;
          this.instructorIdIsRequired = true;

        }

        break;
      case ClassesReports.CLASSES_PER_INS_AND_TYPE_REPORT:
        this.byFromDate = true;
        this.byToDate = true;
        if (this.permissions.hasPermissions(['classesPerInstructorAndTypeReport', 'ShowAllData']))
          this.byInstructorId = true;

        break;
      case ClassesReports.CLASSES_BOOKING_LIST_REPORT:
        this.byFromDate = true;
        this.byToDate = true;
        this.byStatusId = true;
        this.byClassNameId = true;
        if (this.permissions.hasPermissions(['classesBookingListReport', 'ShowAllData']))
          this.byInstructorId = true;
        this.getClassesTypes();
        break;
      case ClassesReports.OTHER_ENTITIES_BOOKINGS_REPORT:
        this.byFromDate = true;
        this.byToDate = true;
        this.byInstructorId = true;
        this.byBranchId = false;
        break;

      default:
        break;
    }
  }

  onBasedOnChange() {
    this.basedOnChange.emit(this.filters.basedOn);
  }

}
