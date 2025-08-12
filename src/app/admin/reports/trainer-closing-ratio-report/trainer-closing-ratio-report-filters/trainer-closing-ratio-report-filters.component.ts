
import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { LookupType } from 'src/app/models/enums';
import { TrainerClosingRatioReportFilter } from 'src/app/models/reports.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-trainer-closing-ratio-report-filters',
  templateUrl: './trainer-closing-ratio-report-filters.component.html',
  styleUrl: './trainer-closing-ratio-report-filters.component.scss',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class TrainerClosingRatioReportFiltersComponent implements OnInit {
  @Input() filters: TrainerClosingRatioReportFilter;
  coaches: any[] = [];
  date: Date = new Date();
  private commonService = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getCoach();
  }

  getCoach() {
    this.commonService.getLookup(LookupType.Trainers).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.coaches = res;
      }
    })
  }

}
