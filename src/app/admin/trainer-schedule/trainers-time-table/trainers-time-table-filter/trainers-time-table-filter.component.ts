
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { TrainerTimeTableFilters } from 'src/app/models/common.model';


@Component({
    selector: 'app-trainers-time-table-filter',
    templateUrl: './trainers-time-table-filter.component.html',
    styleUrl: './trainers-time-table-filter.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class TrainersTimeTableFilterComponent implements OnInit {
  @Input() filters: TrainerTimeTableFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  @Input() trainers: any[] = [];

  private translate = inject(TranslateService);

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }



  clearFilter() {
    this.filters.fromDate = moment().clone().startOf('month').format();
    this.filters.toDate = moment().clone().endOf('month').format();
    this.filters.employeeId = undefined;
    this.onFilter.emit();
  }
}
