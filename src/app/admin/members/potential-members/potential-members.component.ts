import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CallMember, CallsFilters, dialogMemberReminder, dialogPossibleMemberData, IChangeSalesDialog, IPossibleMember, Member, Note, PotentialMemberFilters } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { CallFormComponent } from 'src/app/admin/members/calls/call-form/call-form.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { PotentialMemberFormComponent } from './potential-member-form/potential-member-form.component';
import { AppConfigService } from 'src/app/services/app-config.service';
import { dialogAttachmentData } from 'src/app/models/staff.model';
import { AttachmentModalFormComponent } from 'src/app/shared/attachments/attachment-modal-form/attachment-modal-form.component';
import { AttachmentsComponent } from 'src/app/shared/attachments/attachments.component';
import { AttachmentContextTypeId } from 'src/app/models/enums';
import { MemberReminderFormComponent } from '../member-reminder-form/member-reminder-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ITasks, dialogTasksData } from 'src/app/models/extra.model';
import { TasksFormComponent } from '../tasks/tasks-form/tasks-form.component';
import { Platform } from '@angular/cdk/platform';
import { GenderPipe } from '../../../pipes/gender.pipe';
import { MemberCallsComponent } from '../calls/member-calls/member-calls.component';
import { MemberNotesComponent } from '../notes/member-notes/member-notes.component';
import { AttachmentsComponent as AttachmentsComponent_1 } from '../../../shared/attachments/attachments.component';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PotentialMemberFiltersComponent } from './potential-member-filters/potential-member-filters.component';
import { BidiModule } from '@angular/cdk/bidi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RoleDirective } from '../../../directives/role.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, DatePipe, JsonPipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UploadBulkMembersComponent } from './upload-bulk-members/upload-bulk-members.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonService } from 'src/app/services/common.service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeSalesPersonModalComponent } from '../memberships/change-sales-person-modal/change-sales-person-modal.component';


@Component({
  selector: 'app-potential-members',
  templateUrl: './potential-members.component.html',
  styleUrls: ['./potential-members.component.scss'],
  imports: [MatSidenavModule, NgClass, MatButtonModule, MatIconModule, RoleDirective, MatProgressSpinnerModule, BidiModule, PotentialMemberFiltersComponent, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, AttachmentsComponent_1, MemberNotesComponent, MemberCallsComponent, DatePipe, GenderPipe, TranslateModule, FormsModule, MatInputModule, MatFormFieldModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatTooltipModule, MatCheckboxModule]
})
export class PotentialMembersComponent implements OnInit {
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;
  @ViewChild('attachmentsComp') attachmentsComp: AttachmentsComponent;
  @ViewChild('historyModal') historyModal: TemplateRef<any>;
  @ViewChild('notesModal') notesModal: TemplateRef<any>;
  @ViewChild('callsModal') callsModal: TemplateRef<any>;
  @ViewChild('editNameModal') editNameModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  displayedColumns: string[] = [
    'select',
    'joiningDate',
    // 'guestCardNumber',
    'nameEng',
    // 'nameAR',
    'phoneNo',
    'gender',
    'comment',
    'salesPerson',
    'source',
    'userName',
    'lastCall',
    'highPotential',
    'actions'
  ];
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;

  dataSource: MatTableDataSource<IPossibleMember> = new MatTableDataSource();
  loading: boolean;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filters: PotentialMemberFilters = new PotentialMemberFilters();
  totalElements: number;
  page: number = 0;
  perPage: number = 10;
  width = screen.width;
  selectedMember: IPossibleMember;
  member: any;
  members: IPossibleMember[];
  memberHistory: string[];
  possibleMember: IPossibleMember;
  notes: Note[] = [];
  calls: CallMember[] = [];
  phoneModalData: IPossibleMember = {} as IPossibleMember;
  platform = inject(Platform);
  private memberService = inject(MemberService);
  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private commonService = inject(CommonService);
  selection = new SelectionModel<IPossibleMember>(true, []);
  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as PotentialMemberFilters;
        this.page = Math.floor(this.filters.skipCount! / this.filters.takeCount!);
      }
    });

    const _skipCount = this.route.snapshot.queryParams['skipCount'];
    const _takeCount = this.route.snapshot.queryParams['takeCount'];
    const _page = this.route.snapshot.queryParams['page'];
    this.filters.skipCount = _skipCount ? +_skipCount : 0;
    this.filters.takeCount = _takeCount ? +_takeCount : 10;
    this.perPage = _takeCount ? +_takeCount : 10;
    this.page = _page ? +_page : 0;

    this.getMembers();
  }

  getNotes(member: IPossibleMember, openModal: boolean = true) {
    this.member = member;
    this.memberService.getMemberNotes(member.id).subscribe({
      next: (res) => {
        this.notes = res.data;
        if (openModal) {
          this.dialog.open(this.notesModal, {
            autoFocus: false
          });
        }
      }
    })
  }

  getCalls(member: IPossibleMember, openModal: boolean = true) {
    this.member = member;
    let filters = new CallsFilters();
    filters.memberId = member.id;
    this.memberService.getCalls(filters).subscribe({
      next: (res) => {
        this.calls = res.data;
        if (openModal) {
          this.dialog.open(this.callsModal, {
            autoFocus: false
          });
        }
      }
    })
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
    this.memberService.getPossibleMembers(this.filters).subscribe({
      next: (res) => {
        this.members = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.sort = this.sort;
        this.markSelectedRows();
      },
    });
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getMembers();
  }

  onPaginationChange(e: PageEvent) {
    this.page = e.pageIndex;
    this.perPage = e.pageSize;
    this.filters.skipCount = this.page * this.perPage;
    this.filters.takeCount = this.perPage;

    this.router.navigate([], {
      queryParams: {
        skipCount: this.filters.skipCount,
        takeCount: this.filters.takeCount,
        page: this.page
      },
      queryParamsHandling: 'merge'
    });

    this.commonService.setRouteFilters(this.filters);
    this.getMembers();
  }

  addCall(member: IPossibleMember) {
    let data = {} as dialogPossibleMemberData;
    data.type = 'addCall';
    data.memberData = member;
    let dialogRef = this.dialog.open(CallFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });
  }


  viewMemberHistory(member: IPossibleMember) {
    if (member.history)
      this.memberHistory = member.history
        .split('\r\n')
        .filter((el) => el.trim().length !== 0);
    else this.memberHistory = [];

    let dialogRef = this.dialog.open(this.historyModal, {
      width: '600px',
    });
  }


  editMember(member: IPossibleMember) {
    let data = {} as dialogPossibleMemberData;
    data.type = 'editMember';
    data.memberData = member;

    let dialogRef = this.dialog.open(PotentialMemberFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMembers();
      }
    });
  }

  editNameMember(member: IPossibleMember) {
    this.possibleMember = { ...member };
    let dialogRef = this.dialog.open(this.editNameModal, {
      width: '300px',
    });
  }

  editPotentialName() {
    this.memberService.editPotentialName(this.possibleMember).subscribe({
      next: (res) => {
        this.getMembers();
        this.dialog.closeAll();
      },
    });

  }

  addMember() {
    let data = {} as dialogPossibleMemberData;
    data.type = 'addMember';

    let dialogRef = this.dialog.open(PotentialMemberFormComponent, {
      maxHeight: '80vh',
      width: '500px',
      data: data,
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status && result.status === 'success') {
        this.getMembers();
      }
    });

  }

  onDeleteMember(member: IPossibleMember) {
    this.selectedMember = member;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedMember'), subTitle: `${member.nameEng} (${member.nameAR})` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status && result.status === 'yes') {
        this.deleteMember();
      }
    });
  }

  deleteMember() {
    this.memberService.deleteMember(this.selectedMember.id).subscribe({
      next: () => {
        this.members = this.members.filter(m => m.id != this.selectedMember.id);
        this.dataSource = new MatTableDataSource(this.members);
      }
    });
  }

  getCardAction(action: { actionType: string, member: IPossibleMember }) {
    this.selectedMember = action.member;
    switch (action.actionType) {
      case 'addCall':
        this.addCall(action.member);
        break;
      case 'history':
        this.viewMemberHistory(action.member);
        break;
      case 'delete':
        this.onDeleteMember(action.member);
        break;
      default:
        this.editMember(action.member);
        break;
    }
  }

  onAttachments(member: IPossibleMember) {
    this.selectedMember = member;
    this.dialog.open(this.attachmentsModal, {
      width: '800px',
      autoFocus: false
    });
  }

  contextTypeId = AttachmentContextTypeId.MEMBERS;
  addAttachment(member: IPossibleMember) {
    let data: dialogAttachmentData = {} as dialogAttachmentData;
    data.contextId = member.id;
    data.contextTypeId = this.contextTypeId
    let dialogRef = this.dialog.open(AttachmentModalFormComponent, {
      maxHeight: '80vh',
      width: '300px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.attachmentsComp.getAttachments();
      }
    });
  }

  addReminder(member: Member) {
    let data = {} as dialogMemberReminder;
    data.type = 'add';
    data.memberData = member;
    data.dataType = "POSSIBLE_MEMBER";
    let dialogRef = this.dialog.open(MemberReminderFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });
  }

  addTask(member: Member) {
    let data = {} as dialogTasksData;
    data.type = 'add';
    data.memberData = member;
    data.task = {} as ITasks;
    data.task.memberId = member.id;

    let dialogRef = this.dialog.open(TasksFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });
  }

  openWhatsapp(member: Member) {
    let fullNumber = (member.countryCode ?? '') + '' + member.phoneNo;
    let url = this.platform.ANDROID || this.platform.IOS ? 'https://wa.me/' : 'https://web.whatsapp.com/send?phone=';
    window.open(`${url}${fullNumber}`, '_blank');
  }

  directCall(member: Member) {
    window.location.href = `tel:${member.phoneNo}`;
  }

  onUploadBulk() {
    const dialogRef = this.dialog.open(UploadBulkMembersComponent, {
      maxHeight: '80vh',
      width: '400px',
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res && res.status === 'success') {
        this.getMembers();
      }
    })
  }

  isHighPotential(member: IPossibleMember) {
    if (member.isHighPotential) {
      this.memberService.unMarkAsHighPotential(member.id).subscribe({
        next: (res) => {
          this.getMembers();
        },
      });
    }
    else {
      this.memberService.markAsHighPotential(member.id).subscribe({
        next: (res) => {
          this.getMembers();
        },
      });
    }
  }

  openPhonePopup(member: IPossibleMember) {
    this.phoneModalData = member;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }

  onSelection(e: MatCheckboxChange, type: 'ROW' | 'ALL', row?: IPossibleMember) {
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
  checkboxLabel(row?: IPossibleMember): string {
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
      entityType: 'potential',
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
