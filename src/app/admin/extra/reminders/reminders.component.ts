import { BidiModule } from '@angular/cdk/bidi';
import { NgClass, DatePipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IReminder, ReminderFilters } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { RemindersFiltersComponent } from './reminders-filters/reminders-filters.component';
import { mergeMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import moment from 'moment';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-reminders',
    templateUrl: './reminders.component.html',
    styleUrl: './reminders.component.scss',
    imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, RemindersFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, FormsModule, DatePipe, TranslateModule]
})
export class RemindersComponent implements OnInit {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  reminders: IReminder[] = [];
  dataSource: MatTableDataSource<IReminder>;
  displayedColumns: string[] = [
    'reminderDate',
    'memberName',
    'notes',
    'createdToUsername',
    'username',
    'dismiss'
  ];
  width = screen.width;
  filters: ReminderFilters = new ReminderFilters();
  totalElements: number;
  page: number;
  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as ReminderFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getReminders();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getReminders();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.filters.skipCount = e.pageIndex * this.filters.takeCount;
    this.filters.takeCount = e.pageSize;
    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });
    this.commonService.setRouteFilters(this.filters);
    this.getReminders();
  }

  reset() {
    this.router.navigate([], {
      queryParams: {
        contextId: null
      },
      queryParamsHandling: 'merge'
    });
    this.filters.reminderDateFrom = moment().startOf('month').utc();
    this.filters.reminderDateTo = moment().endOf('month').utc();
    delete this.filters.id;
  }

  getReminders() {
    this.route.queryParams.pipe(mergeMap((params) => {
      if (params['contextId']) {
        this.filters.id = +params['contextId'];
        delete this.filters.reminderDateFrom;
        delete this.filters.reminderDateTo;
      }
      return this.extraService.getReminders(this.filters)
    }), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.reminders = res.data;
          this.totalElements = res.totalCount;
          this.dataSource = new MatTableDataSource(this.reminders);
          this.dataSource.sort = this.sort;
        }
      })
  }

  dismissReminder(reminder: IReminder) {
    this.extraService.dismissReminder(reminder.id).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.getReminders();
        }
      }
    })
  }
}
