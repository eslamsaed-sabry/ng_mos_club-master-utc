
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Gender, LookupType } from 'src/app/models/enums';
import { FreePrivateTrainingFilters } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-free-private-training-report-filter',
    templateUrl: './free-private-training-report-filter.component.html',
    styleUrl: './free-private-training-report-filter.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, TranslateModule, MatDatepickerModule, MatCheckboxModule]
})
export class FreePrivateTrainingReportFilterComponent {
  @Input() filters: FreePrivateTrainingFilters | any;
  trainers: any[] = [];
  gender = Gender;

  private commonService = inject(CommonService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getTrainers();
  }

  getTrainers() {
    this.commonService.getLookup(LookupType.Trainers).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.trainers = res;
      }
    })
  }

  onChange(fieldName: string, value: any) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = new Date();;
    }
  }
}
