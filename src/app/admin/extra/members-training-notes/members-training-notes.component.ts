import { BidiModule } from '@angular/cdk/bidi';
import { DatePipe, NgClass } from '@angular/common';
import { Component, DestroyRef, ViewChild, effect, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MembersTrainingNotesFormComponent } from './members-training-notes-form/members-training-notes-form.component';
import { FormsModule } from '@angular/forms';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ITrainingNotes, dialogMembersTrainingNotesData } from 'src/app/models/extra.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { Note } from 'src/app/models/member.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-members-training-notes',
    templateUrl: './members-training-notes.component.html',
    styleUrl: './members-training-notes.component.scss',
    imports: [MatSidenavModule, MatButtonModule, MatIconModule, BidiModule, MatTableModule, MatSortModule, RouterLink, MatMenuModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, FormsModule, DatePipe, TranslateModule]
})
export class MembersTrainingNotesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  memberId = input<number>();
  note: Note[] = [];
  dataSource: MatTableDataSource<Note>;
  displayedColumns: string[] = [
    'creationDate',
    'memberName',
    'note',
    'userName',
    'edit',
    'delete',

  ];
  width = screen.width;
  totalElements: number;
  page: number = 0;

  public dialog = inject(MatDialog);
  private memberService = inject(MemberService);
  private translate = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commonService = inject(CommonService);


  filters = {} as ITrainingNotes;

  constructor() {
    effect(() => {
      this.filters.memberId = this.memberId();
      this.filters.skipCount = 0;
      this.filters.takeCount = 10;
      this.commonService.fetchRouteFilters().subscribe((params) => {
        if (params) {
          this.filters = { ...params } as ITrainingNotes;
          this.page = Math.floor(this.filters.skipCount / this.filters.takeCount);
        }
      });
      this.getMembersTrainingNotes();
    })
  }

  applyFilter() {
    this.commonService.setRouteFilters(this.filters);
    this.getMembersTrainingNotes();
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
    this.getMembersTrainingNotes();
  }

  getMembersTrainingNotes() {
    this.memberService.getMembersTrainingNotes(this.filters).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.note = res.data;
        this.totalElements = res.totalCount;
        this.dataSource = new MatTableDataSource(this.note);
        this.dataSource.sort = this.sort;
      }
    })
  }

  openMembersTrainingNotesForm(actionType: string, note?: Note) {
    let data = {} as dialogMembersTrainingNotesData;
    data.membersTrainingNotes = note;
    data.type = actionType;
    data.memberId = this.memberId();
    let dialogRef = this.dialog.open(MembersTrainingNotesFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.getMembersTrainingNotes();
      }
    });
  }

  onDeleteMembersTrainingNotes(note: Note) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedNote'), subTitle: `${note.note}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteMembersTrainingNotes(note.id);
      }
    });
  }

  deleteMembersTrainingNotes(noteId: number) {
    this.memberService.deleteNote(noteId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.getMembersTrainingNotes();
        }
      }
    })
  }

}
