
import { Component, DestroyRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MembershipUpgradeReportFilter } from 'src/app/models/reports.model';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-membership-upgrade-filters',
    templateUrl: './membership-upgrade-filters.component.html',
    styleUrl: './membership-upgrade-filters.component.scss',
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, TranslateModule, MatSelectModule]
})
export class MembershipUpgradeFiltersComponent {
  @Input() filters: MembershipUpgradeReportFilter;
  users: any[] = [];

  private reportService = inject(ReportsService);
  destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.reportService.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        console.log(res);

        this.users = res.data;
      }
    })
  }
}
