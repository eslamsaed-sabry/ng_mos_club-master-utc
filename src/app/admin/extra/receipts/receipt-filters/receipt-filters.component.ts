import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import moment from 'moment';
import { Receipt } from 'src/app/models/extra.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';
@Component({
    selector: 'app-receipt-filters',
    templateUrl: './receipt-filters.component.html',
    styleUrls: ['./receipt-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, TranslateModule]
})
export class ReceiptFiltersComponent implements OnInit {
  @Input() filters: Receipt;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
  }

  onChange(fieldName: keyof Receipt, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = <never>null;
    } else {
      switch (fieldName) {
        case "paymentFromDate":
        case "paymentToDate":
          this.filters[fieldName] = moment(new Date()).format("YYYY-MM-DD") + 'T' + moment(new Date()).format('HH:mm');
          break;
        default:
          this.filters[fieldName] = <never>new Date();
          break;
      }
    }
  }


}
