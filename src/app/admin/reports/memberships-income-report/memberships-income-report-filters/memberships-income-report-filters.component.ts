
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MembershipsIncomeFilters } from 'src/app/models/reports.model';
import { PermissionsPipe } from 'src/app/pipes/permissions.pipe';
import { BrandService } from 'src/app/services/brand.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-memberships-income-report-filters',
    templateUrl: './memberships-income-report-filters.component.html',
    styleUrl: './memberships-income-report-filters.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, TranslateModule, PermissionsPipe]
})
export class MembershipsIncomeReportFiltersComponent implements OnInit {
  @Input() filters: MembershipsIncomeFilters;
  users: any[] = [];
  branches: any[] = [];
  constructor(private reportService: ReportsService, public brandService: BrandService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getBranches();
  }

  getUsers() {
    this.reportService.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      }
    })
  }

  getBranches() {
    this.branches = this.brandService.branches;
  }

  onSelect() {
    if (this.filters.branchesIds.includes(0)) {
      this.filters.branchesIds = [0, ...this.branches.map(el => el.id)];
    } else {
      this.filters.branchesIds = [];
    }
  }

}
