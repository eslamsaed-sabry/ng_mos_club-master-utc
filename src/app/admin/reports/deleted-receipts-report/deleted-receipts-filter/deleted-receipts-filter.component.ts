import { Component, Input, OnInit } from '@angular/core';
import { DeletedReceiptsReportFilter } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-deleted-receipts-filter',
    templateUrl: './deleted-receipts-filter.component.html',
    styleUrls: ['./deleted-receipts-filter.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class DeletedReceiptsFilterComponent implements OnInit {

  @Input() filters: DeletedReceiptsReportFilter;
  constructor() { }

  ngOnInit(): void {
  }



}
