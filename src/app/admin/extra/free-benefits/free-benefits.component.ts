import { Component, OnInit, ViewChild, EventEmitter, Output, inject, DestroyRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { GymConfig } from 'src/app/models/enums';
import { IFreeBenefit, FreeBenefitFilters } from 'src/app/models/extra.model';
import { ExtraService } from 'src/app/services/extra.service';
import { MemberService } from 'src/app/services/member.service';
import { FreeBenefitsReceiptComponent } from './free-benefits-receipt/free-benefits-receipt.component';
import { TranslateModule } from '@ngx-translate/core';
import { FreeBenefitsFiltersComponent } from './free-benefits-filters/free-benefits-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
@Component({
    selector: 'app-free-benefits',
    templateUrl: './free-benefits.component.html',
    styleUrls: ['./free-benefits.component.scss'],
    imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, FreeBenefitsFiltersComponent, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class FreeBenefitsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  freeBenefits: IFreeBenefit[] = [];
  dataSource: MatTableDataSource<IFreeBenefit>;
  displayedColumns: string[] = [
    'sessionDate',
    'trainerName',
    'benfitName',
    'memberName',
    'print'
  ];
  width = screen.width;
  filters: FreeBenefitFilters = new FreeBenefitFilters();
  totalElements: number;
  page: number;
  currentContextId: number;
  currentContextTypeId: number;

  public dialog = inject(MatDialog);
  private extraService = inject(ExtraService);
  private memberService = inject(MemberService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as FreeBenefitFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });

    this.getFreeBenefits();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getFreeBenefits();
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
    this.getFreeBenefits();
  }

  getFreeBenefits() {
    this.extraService.getFreeBenefits(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.freeBenefits = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.freeBenefits);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getReceiptType(benefit: IFreeBenefit) {
    this.memberService.getGymConfig(GymConfig.receiptType).subscribe({
      next: (res) => {
        benefit.receiptType = res.data;
        this.print(benefit);
      }
    })
  }

  print(benefit: IFreeBenefit) {
    let dialogRef = this.dialog.open(FreeBenefitsReceiptComponent, {
      maxHeight: '90vh',
      width: '700px',
      data: benefit,
      autoFocus: false,
      id: "printable-receipt"
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
