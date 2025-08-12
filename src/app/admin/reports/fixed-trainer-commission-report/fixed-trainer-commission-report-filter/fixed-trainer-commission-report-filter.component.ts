
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { FixedTrainerCommissionReportFilter } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-fixed-trainer-commission-report-filter',
  templateUrl: './fixed-trainer-commission-report-filter.component.html',
  styleUrl: './fixed-trainer-commission-report-filter.component.scss',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDatepickerModule, TranslateModule]
})
export class FixedTrainerCommissionReportFilterComponent implements OnInit {
  @Input() filters: FixedTrainerCommissionReportFilter | any;
  destroyRef = inject(DestroyRef);

  trainer: any[] = [];

  public memberService = inject(MemberService);
  public reportService = inject(ReportsService);

  ngOnInit(): void {
    this.getTrainer();
  }

  getTrainer() {
    this.memberService.getLookup(LookupType.Trainers).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((res: any) => {
      this.trainer = res;
    })
  }

  onChange(fieldName: string, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = new Date();;
    }
  }

}
