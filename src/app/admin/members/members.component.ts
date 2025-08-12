import { Component, OnInit, TemplateRef, ViewChild, HostListener, inject, DestroyRef } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IChangeSalesDialog, Member, MemberFilters, styleMemberAction } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AttachmentsComponent } from 'src/app/shared/attachments/attachments.component';
import { TranslateModule } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { GenderPipe } from '../../pipes/gender.pipe';
import { MemberCardComponent } from '../../shared/member-card/member-card.component';
import { MemberActionsComponent } from '../../shared/member-actions/member-actions.component';
import { TableFiltersComponent } from './table-filters/table-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleDirective } from '../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TableCardSwitcherComponent } from '../../shared/table-card-switcher/table-card-switcher.component';
import { NgClass, DatePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeSalesPersonModalComponent } from './memberships/change-sales-person-modal/change-sales-person-modal.component';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  imports: [
    MatSidenavModule,
    NgClass,
    TableCardSwitcherComponent,
    MatButtonModule,
    MatIconModule,
    RoleDirective,
    MatProgressSpinnerModule,
    BidiModule,
    TableFiltersComponent,
    MatTableModule,
    MatSortModule,
    MemberActionsComponent,
    MatPaginatorModule,
    MemberCardComponent,
    DatePipe,
    GenderPipe,
    TranslateModule,
    RouterModule,
    MatCheckboxModule
]
})
export class MembersComponent implements OnInit {
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;
  @ViewChild('attachmentsComp') attachmentsComp: AttachmentsComponent;
  @ViewChild('historyModal') historyModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  displayedColumns: string[] = [
    'select',
    'applicationNo',
    'code',
    'nameEng',
    'nameAR',
    'phoneNo',
    'birthDate',
    'gender',
    'salesName',
    'actions',
    'edit'
  ];
  dataSource: MatTableDataSource<Member> = new MatTableDataSource();
  loading: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number;
  phoneModalData: Member = {} as Member;

  width = screen.width;
  selectedMember: Member;
  members: any[];
  cards: Member[] = [];
  viewMode: string = 'card';
  filters: MemberFilters = { skipCount: 0, takeCount: 20, ...new MemberFilters() };
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  styleMember: styleMemberAction;

  private memberService = inject(MemberService);
  public dialog = inject(MatDialog);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);
  selection = new SelectionModel<Member>(true, []);

  ngOnInit(): void {
    this.styleMember = {} as styleMemberAction;
    this.styleMember.isButton = false;
    this.filters.isPossibleMember = false;

    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params)
        this.filters = { ...params } as MemberFilters;
    });

    this.getMembers();
  }


  getExportedData() {
    this.loading = true;
    let newFilters = { ...this.filters };
    delete newFilters.skipCount;
    delete newFilters.takeCount;
    let props = {
      ...newFilters,
      showToastr: 'false',
      showSpinner: 'false'
    }

    this.memberService.exportMembers(props).subscribe({
      next: (res) => {
        this.loading = false;
        window.open(this.proxyUrl + res.data)
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  getMembers() {
    // this.filters.isPossibleMember = false;

    this.memberService.getMembers(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.members = res.data;
        this.cards = [...this.cards, ...res.data]
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.preventCall = false;
      },
    });
  }

  reset() {
    this.members = [];
    this.cards = [];
    this.filters.skipCount = 0;
  }

  onScrollLoading: boolean;
  preventCall: boolean;
  @HostListener('window:scroll', [])
  onWindowScroll(event: any) {
    const membersLength = +this.filters.skipCount! + +this.filters.takeCount!;

    if (this.viewMode === 'card' && this.totalElements > membersLength) {
      let allPageHeight = document.body.scrollHeight;
      let visiblePageHeight = document.body.clientHeight;
      let maxScroll = allPageHeight - visiblePageHeight;
      let scrollAmount = window.pageYOffset;

      if (allPageHeight > visiblePageHeight && !this.preventCall) {
        if (maxScroll < (scrollAmount + 60)) {
          this.preventCall = true;
          this.onScrollLoading = true;
          this.filters.skipCount = +this.filters.skipCount! + +this.filters.takeCount!;
          this.commonService.setRouteFilters(this.filters);
          this.getMembers();
        }
      }
    }
  }

  onPaginationChange(e: PageEvent) {
    this.filters.skipCount = e.pageIndex * +this.filters.takeCount!;
    this.filters.takeCount = e.pageSize;
    this.commonService.setRouteFilters(this.filters);
    this.getMembers();
  }



  getFilters(filters: MemberFilters) {
    this.members = [];
    this.cards = [];
    this.filters = filters;
    this.filters.skipCount = 0;
    this.filters.takeCount = 20;
    this.preventCall = true;
    this.filters.isPossibleMember = false;
    this.commonService.setRouteFilters(filters);
    this.getMembers();
  }


  viewMember(member: Member, selectedTab: string = '') {
    this.router.navigate(['/admin/member-profile/' + member.id])
  }

  // editMember(member: Member, selectedTab: string = '') {
  //   let data = {} as dialogMemberData;
  //   data.type = 'edit';
  //   data.memberData = member;
  //   data.selectedTab = selectedTab;

  //   let dialogRef = this.dialog.open(MemberFormComponent, {
  //     maxHeight: '80vh',
  //     width: '900px',
  //     data: data,
  //     autoFocus: false
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.status === 'success') {
  //       this.reset();
  //       this.getMembers();
  //     }
  //   });
  // }

  addMember() {
    this.router.navigate(['/admin/form/member/add']);
  }

  getCardAction(action: { actionType: string, member: Member }) {
    this.selectedMember = action.member;
    switch (action.actionType) {
      default:
        this.router.navigate(['/admin/form/member/edit'], {
          queryParams: {
            memberId: action.member.id,
            backTo: 'list'
          }
        })
        // this.editMember(action.member);
        break;
    }
  }

  openPhonePopup(member: Member) {
    this.phoneModalData = member;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

  onSelection(e: MatCheckboxChange, type: 'ROW' | 'ALL', row?: Member) {
    if (e) {
      if (type === 'ALL') {
        this.toggleAllRows();
      } else if (type === 'ROW') {
        this.selection.toggle(row!)
      }
    }

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Member): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  markSelectedRows() {
    if (this.selection.selected.length) {
      this.dataSource.data.forEach(row => {
        const _row = this.selection.selected.find(el => el.id === row.id)
        if (_row) {
          this.selection.deselect(_row);
          this.selection.select(row);
        }
      })
    }
  }

  changeSalesPerson() {
    let data: IChangeSalesDialog = {
      id: this.selection.selected[0].salesPersonId,
      type: 'salesPerson',
      isBulk: true,
      entityType: 'member',
      membersID: this.selection.selected.map(m => m.id)
    };
    const downDialogRef = this.dialog.open(ChangeSalesPersonModalComponent, {
      maxHeight: '80vh',
      width: '600px',
      data: data,
      autoFocus: false
    });
    downDialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMembers();
        this.selection.clear();
      }
    });
  }

}
