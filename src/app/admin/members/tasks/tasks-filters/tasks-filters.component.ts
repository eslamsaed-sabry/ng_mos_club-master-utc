import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import moment from "moment";
import { LookupType } from "src/app/models/enums";
import { TasksFilters } from "src/app/models/extra.model";
import { CommonService } from "src/app/services/common.service";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { BidiModule } from "@angular/cdk/bidi";
import { FormsModule } from "@angular/forms";
import { forkJoin } from "rxjs";


@Component({
    selector: 'app-tasks-filters',
    templateUrl: './tasks-filters.component.html',
    styleUrls: ['./tasks-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatDatepickerModule, MatButtonModule, TranslateModule]
})
export class TasksFiltersComponent implements OnInit {
  @Input() filters: TasksFilters | any;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  sales: any[] = [];
  source: any[] = [];
  currentLang: string;

  constructor(private common: CommonService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getLookUps();
  }

  getLookUps() {
    forkJoin([
      this.common.getLookup(LookupType.Sales),
      this.common.getLookup(LookupType.SourceOfKnowledge),
    ])
      .subscribe({
        next: ([sales, source]) => {
          this.sales = sales;
          this.source = source;
        }
      })

  }

  onChange(fieldName: string, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
  }
}
