import { Component, DestroyRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild, inject } from "@angular/core";
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle } from "@angular/material/dialog";
import { MatPaginator, PageEvent, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { TranslateModule } from "@ngx-translate/core";
import { IFreePrivateTraining, FreePrivateTrainingFilters } from "src/app/models/extra.model";
import { MemberService } from "src/app/services/member.service";
import { Benefit, BenefitSession, IChangeSalesDialog } from "src/app/models/member.model";
import { ChangeSalesPersonModalComponent } from "../memberships/change-sales-person-modal/change-sales-person-modal.component";
import { GenderPipe } from "../../../pipes/gender.pipe";
import { MemberBenefitsSessionsComponent } from "../benefits-sessions/member-benefits-sessions/member-benefits-sessions.component";
import { RoleDirective } from "../../../directives/role.directive";
import { MatMenuModule } from "@angular/material/menu";
import { Router, RouterLink } from "@angular/router";
import { FreePrivateTrainingFiltersComponent } from "./free-private-training-filters/free-private-training-filters.component";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { NgClass, DatePipe } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RoleAttrDirective } from "src/app/directives/role-attr.directive";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonService } from "src/app/services/common.service";
import { debounceTime, Subject } from "rxjs";

@Component({
  selector: 'app-free-private-training',
  templateUrl: './free-private-training.component.html',
  styleUrl: './free-private-training.component.scss',
  imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, BidiModule, FreePrivateTrainingFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, RoleDirective, MatPaginatorModule, MemberBenefitsSessionsComponent, DatePipe, GenderPipe, TranslateModule, MatCheckboxModule, FormsModule, RoleAttrDirective, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatTooltipModule]
})
export class FreePrivateTrainingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('benefitModal') benefitModal: TemplateRef<any>;
  @ViewChild('updateTrainerCommentModal') updateTrainerCommentModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  private inputSearchSubject = new Subject<string>();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  freePrivatesTraining: IFreePrivateTraining[] = [];
  freePrivateTraining: IFreePrivateTraining = {} as IFreePrivateTraining;
  dataSource: MatTableDataSource<IFreePrivateTraining>;
  displayedColumns: string[] = [
    'contractNo',
    'phoneNumber',
    'memberName',
    'gender',
    'paymentDate',
    'startDate',
    'package',
    'status',
    'notes',
    'salesPersonName',
    'PTSessionsCount',
    'ptSessionsConsumedCount',
    'trainerName',
    'trainerComment',
    'actions'
  ];
  width = screen.width;
  filters: FreePrivateTrainingFilters | any = new FreePrivateTrainingFilters();
  totalElements: number;
  page: number;
  resolutionSummary: string;
  sessions: BenefitSession[] = [];
  membershipId: number;
  benefit: Benefit = {} as Benefit;
  phoneModalData: IFreePrivateTraining = {} as IFreePrivateTraining;

  public dialog = inject(MatDialog);
  private memberService = inject(MemberService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private commonService = inject(CommonService);


  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        let _params = { ...params };
        if (params['contextId']) {
          _params = { membershipId: +params['contextId'] }
        }
        this.filters = { ..._params } as FreePrivateTrainingFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
      this.getFreePrivateTraining();
    });

    this.inputSearchSubject.pipe(
      debounceTime(1200)
    ).subscribe(value => {
      this.commonService.setRouteFilters(this.filters);
      this.getFreePrivateTraining();
    });
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getFreePrivateTraining();
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
    this.getFreePrivateTraining();
  }

  getFreePrivateTraining() {
    this.memberService.getFreePrivateTraining(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.freePrivatesTraining = res.data;

        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.freePrivatesTraining);
        this.dataSource.sort = this.sort;
      }
    })
  }

  getBenefit(freePrivateTraining: IFreePrivateTraining) {
    this.membershipId = freePrivateTraining.membershipId;
    this.benefit.id = freePrivateTraining.ptBenefitId;
    this.benefit.consumedCount = 0;
    this.benefit.count = freePrivateTraining.ptSessionsCount;

    this.getSessions();

    this.dialog.open(this.benefitModal, {
      autoFocus: false,
      maxHeight: '90vh'
    });

  }

  hide(freePrivateTraining: IFreePrivateTraining) {
    this.memberService.hideFreePrivateTraining(freePrivateTraining.membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getFreePrivateTraining();
      }
    })
  }

  unHide(freePrivateTraining: IFreePrivateTraining) {
    this.memberService.unHideFreePrivateTraining(freePrivateTraining.membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getFreePrivateTraining();
      }
    })
  }

  markAsReferral(freePrivateTraining: IFreePrivateTraining) {
    this.memberService.markAsReferralFreePrivateTraining(freePrivateTraining.membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getFreePrivateTraining();
      }
    })
  }

  unMarkAsReferral(freePrivateTraining: IFreePrivateTraining) {
    this.memberService.unMarkAsReferralFreePrivateTraining(freePrivateTraining.membershipId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getFreePrivateTraining();
      }
    })
  }

  updateTrainerComment(freePrivateTraining: IFreePrivateTraining) {
    this.freePrivateTraining = { ...freePrivateTraining }
    let dialogRef = this.dialog.open(this.updateTrainerCommentModal, {
      width: '500px',
    });
  }

  editTrainerComment() {
    this.memberService.updateTrainerCommentFreePrivateTraining(this.freePrivateTraining.membershipId, this.freePrivateTraining.trainerComment).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.getFreePrivateTraining();
        this.dialog.closeAll();
      }
    })
  }

  getSessions() {
    this.memberService.getBenefitSessions(this.membershipId, this.benefit.id).subscribe({
      next: (res) => {
        this.sessions = res.data;
      }
    })
  }

  changeEmployee(freePrivateTraining: IFreePrivateTraining, type: 'salesPerson' | 'trainer') {
    let data: IChangeSalesDialog = {
      id: freePrivateTraining.trainerId,
      type: type,
      membershipId: freePrivateTraining.membershipId
    };

    const downDialogRef = this.dialog.open(ChangeSalesPersonModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });

    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getFreePrivateTraining();
      }
    });
  }

  removeTrainer(freePrivateTraining: IFreePrivateTraining) {
    let changeEmployeeForm = {
      membershipId: freePrivateTraining.membershipId,
      trainerId: null
    }
    this.memberService.removeTrainer(changeEmployeeForm).subscribe({
      next: (res) => {
        this.getFreePrivateTraining();
      }
    })
  }

  onChange(fieldName: string, value: MatCheckboxChange) {
    if (!value.checked) {
      this.filters[fieldName] = null;
    } else {
      this.filters[fieldName] = new Date();;
    }

    this.applyFilter();
  }



  openPhonePopup(data: IFreePrivateTraining) {
    this.phoneModalData = data;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

  onSearchInput(value: string) {
    this.inputSearchSubject.next(value);
  }
}
