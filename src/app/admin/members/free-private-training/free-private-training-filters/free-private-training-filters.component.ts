import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Gender, LookupType } from 'src/app/models/enums';
import { FreePrivateTrainingFilters } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-free-private-training-filters',
    templateUrl: './free-private-training-filters.component.html',
    styleUrl: './free-private-training-filters.component.scss',
    imports: [FormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatButtonModule, TranslateModule, MatCheckboxModule, FormsModule]
})
export class FreePrivateTrainingFiltersComponent implements OnInit {
  @Input() filters: FreePrivateTrainingFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  trainers: any[] = [];
  locations: any[] = [];
  types: any[] = [];
  gender = Gender;

  constructor(private common: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getTrainers();
  }

  getTrainers() {
    this.common.getLookup(LookupType.Trainers).subscribe({
      next: (res: any) => {
        this.trainers = res;
      }
    })
  }
}
