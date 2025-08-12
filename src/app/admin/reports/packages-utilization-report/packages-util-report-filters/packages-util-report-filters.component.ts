import { Component, OnInit, Input, inject } from '@angular/core';
import { PackagesUtilReport } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Gender, PackageTypes } from 'src/app/models/enums';

@Component({
  selector: 'app-packages-util-report-filters',
  templateUrl: './packages-util-report-filters.component.html',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, TranslateModule, MatSelectModule]
})
export class PackagesUtilReportFiltersComponent implements OnInit {
  @Input() filters: PackagesUtilReport;
  private reportService = inject(ReportsService);
  genders = Gender;
  packageTypesEnum = PackageTypes;

  users: any[] = [];


  ngOnInit(): void {
    this.getUsers();
  }


  getUsers() {
    this.reportService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }

}
