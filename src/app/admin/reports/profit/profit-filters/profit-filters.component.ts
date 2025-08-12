import { Component, inject, Input, OnInit } from '@angular/core';
import { ProfitFilters } from 'src/app/models/reports.model';
import { BrandService } from 'src/app/services/brand.service';
import { ReportsService } from 'src/app/services/reports.service';
import { PermissionsPipe } from '../../../../pipes/permissions.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AsyncPipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { LookupType } from 'src/app/models/enums';

@Component({
  selector: 'app-profit-filters',
  templateUrl: './profit-filters.component.html',
  styleUrls: ['./profit-filters.component.scss'],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatRadioModule, MatCheckboxModule, TranslateModule, PermissionsPipe, AsyncPipe]
})
export class ProfitFiltersComponent implements OnInit {

  @Input() filters: ProfitFilters;
  users: any[] = [];
  branches: any[] = [];
  private commonService = inject(CommonService);
  private reportService = inject(ReportsService);
  public brandService = inject(BrandService);

  paymentType$ = this.commonService.getLookup(LookupType.VisaTypes);

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
