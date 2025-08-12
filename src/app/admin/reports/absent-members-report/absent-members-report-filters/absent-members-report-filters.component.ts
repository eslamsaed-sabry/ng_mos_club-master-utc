import { Component, OnInit, Input } from '@angular/core';
import { IPackage } from 'src/app/models/member.model';
import { AbsentMembersReport } from 'src/app/models/reports.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-absent-members-report-filters',
    templateUrl: './absent-members-report-filters.component.html',
    styleUrls: ['./absent-members-report-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatSelectModule, MatOptionModule, TranslateModule]
})
export class AbsentMembersReportFiltersComponent implements OnInit {
  @Input() filters: AbsentMembersReport;
  packages: IPackage[] = [];

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
    this.getPackages();
  }


  getPackages() {
    this.memberService.getPackages(null).subscribe({
      next: (res) => {
        this.packages = res.data;
      }
    })
  }
}
