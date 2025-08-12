import { Component, OnInit, ViewChild, TemplateRef, inject, DestroyRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { TranslateService, TranslateModule } from "@ngx-translate/core";
import { AttachmentContextTypeId } from "src/app/models/enums";
import { ITasks, TasksFilters, dialogTasksData } from "src/app/models/extra.model";
import { Member, CallMember, Note, CallsFilters } from "src/app/models/member.model";
import { dialogAttachmentData } from "src/app/models/staff.model";
import { MemberService } from "src/app/services/member.service";
import { AttachmentModalFormComponent } from "src/app/shared/attachments/attachment-modal-form/attachment-modal-form.component";
import { AttachmentsComponent } from "src/app/shared/attachments/attachments.component";
import { ConfirmationDialogComponent } from "src/app/shared/confirmation-dialog/confirmation-dialog.component";
import { TasksFormComponent } from "./tasks-form/tasks-form.component";
import { Observable, map } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { GenderPipe } from "../../../pipes/gender.pipe";
import { MemberNotesComponent } from "../notes/member-notes/member-notes.component";
import { AttachmentsComponent as AttachmentsComponent_1 } from "../../../shared/attachments/attachments.component";
import { MemberCallsComponent } from "../calls/member-calls/member-calls.component";
import { MatMenuModule } from "@angular/material/menu";
import { TasksFiltersComponent } from "./tasks-filters/tasks-filters.component";
import { BidiModule } from "@angular/cdk/bidi";
import { MatIconModule } from "@angular/material/icon";
import { RoleDirective } from "../../../directives/role.directive";
import { MatButtonModule } from "@angular/material/button";
import { NgClass, DatePipe } from "@angular/common";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonService } from "src/app/services/common.service";

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    imports: [MatSidenavModule, NgClass, MatButtonModule, RoleDirective, MatIconModule, BidiModule, TasksFiltersComponent, MatTableModule, MatSortModule, MatMenuModule, MatPaginatorModule, MemberCallsComponent, AttachmentsComponent_1, MemberNotesComponent, DatePipe, GenderPipe, TranslateModule, MatCheckboxModule, FormsModule, MatTooltipModule]
})
export class TasksComponent implements OnInit {
  @ViewChild('callsModal') callsModal: TemplateRef<any>;
  @ViewChild('attachmentsModal') attachmentsModal: TemplateRef<any>;
  @ViewChild('attachmentsComp') attachmentsComp: AttachmentsComponent;
  @ViewChild('historyModal') historyModal: TemplateRef<any>;
  @ViewChild('notesModal') notesModal: TemplateRef<any>;
  @ViewChild('phoneModal') phoneModal: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public dialog = inject(MatDialog);
  private translate = inject(TranslateService);
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private commonService = inject(CommonService);

  tasks: ITasks[] = [];
  phoneModalData: ITasks = {} as ITasks;
  dataSource: MatTableDataSource<ITasks>;
  displayedColumns: string[] = [
    'creationDate',
    'memberName',
    'phoneNumber',
    'gender',
    'source',
    'memberSalesPerson',
    'employeeName',
    'notes',
    'createdByName',
    'lastCall',
    'statusName',
    'accomplish',
    'actions'
  ];

  width = screen.width;
  filters: TasksFilters = new TasksFilters();
  totalElements: number;
  resolutionSummary: string;
  member: Member;
  calls: CallMember[] = [];
  memberHistory: string[];
  notes: Note[] = [];
  task: ITasks;
  page: number = 0;


  ngOnInit(): void {
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.commonService.fetchRouteFilters().subscribe((params) => {
      if (params) {
        this.filters = { ...params } as TasksFilters;
        this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
      }
    });
    this.getTasks();
  }

  showAll() {
    this.router.navigate(['/admin/tasks'], {
      queryParams: {},
      queryParamsHandling: ''
    });
    delete this.filters.memberId;
    delete this.filters.memberName;
    this.filters.skipCount = 0;
    this.filters.takeCount = 10;
    this.page = 0;
    this.commonService.setRouteFilters(this.filters);
    this.getTasks();
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getTasks();
  }

  getTasks() {
    this.memberService.getTasks(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.tasks = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.tasks);
        this.dataSource.sort = this.sort;
      }
    })
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
    this.getTasks();
  }

  openTaskForm(data: dialogTasksData) {
    let dialogRef = this.dialog.open(TasksFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getTasks();
      }
    });
  }

  onOpenTasksForm(actionType: string, task?: ITasks) {
    let data = {} as dialogTasksData;
    data.type = actionType;
    if (actionType === 'add') {
      data.task = task;
      data.memberData = {} as Member;
      this.getMemberData(task!.memberId).subscribe({
        next: (member) => {
          data.memberData = member;
          this.openTaskForm(data);
        }
      });
    } else {
      this.openTaskForm(data)
    }
  }

  getMemberData(memberId: number): Observable<Member> {
    return this.memberService.getMemberData(memberId).pipe(map(res => res.data.personalData))
  }

  getCalls(task: ITasks, openModal: boolean = true) {
    this.task = task;

    this.memberService.getMemberData(task.memberId).subscribe({
      next: (res) => {
        this.member = res.data.personalData;
      },
      complete: () => {
        let filters = new CallsFilters();
        filters.memberId = this.member.id;
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
    })
  }

  deleteTask(task: ITasks) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('extra.msgToDeletedTask') },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.memberService.deleteTask(task.id).subscribe({
          next: (res) => {
            this.getTasks();
          }
        })
      }
    });
  }

  accomplishTask(task: ITasks) {
    this.memberService.AccomplishTask(task.id).subscribe({
      next: (res) => {
        this.getTasks();
      }
    })
  }

  unAccomplishTask(task: ITasks) {
    this.memberService.UnaccomplishTask(task.id).subscribe({
      next: (res) => {
        this.getTasks();
      }
    })
  }

  onAttachments(task: ITasks) {
    this.memberService.getMemberData(task.memberId).subscribe({
      next: (res) => {
        this.member = res.data.personalData;
      },
      complete: () => {
        this.dialog.open(this.attachmentsModal, {
          width: '800px',
          autoFocus: false
        });
      }
    })
  }

  contextTypeId = AttachmentContextTypeId.TASKS;
  addAttachment(member: Member) {
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

  viewMemberHistory(task: ITasks) {

    this.memberService.getMemberData(task.memberId).subscribe({
      next: (res) => {
        this.member = res.data.personalData;
      },
      complete: () => {
        if (this.member.history)
          this.memberHistory = this.member.history
            .split('\r\n')
            .filter((el) => el.trim().length !== 0);
        else this.memberHistory = [];

        this.dialog.open(this.historyModal, {
          width: '600px',
        });
      }
    })
  }

  getNotes(task: ITasks, openModal: boolean = true) {
    this.task = task;

    this.memberService.getMemberData(task.memberId).subscribe({
      next: (res) => {
        this.member = res.data.personalData;
      },
      complete: () => {
        this.memberService.getMemberNotes(this.member.id).subscribe({
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
    })
  }

  onAccomplished(row: ITasks) {
    this.memberService.accomplishTask(row.id).subscribe({
      next: (res) => {
        this.getTasks();
      }
    })
  }

  goToMemberProfile(m: ITasks) {
    this.router.navigate(['/admin/member-profile', m.memberId])
  }


  openPhonePopup(data: ITasks) {
    this.phoneModalData = data;
    this.dialog.open(this.phoneModal, {
      autoFocus: false,
      width: '400px',
    });
  }
}
