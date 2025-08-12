import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { dialogMemberData, dialogMemberNoteData, Member, Note } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { NoteFormComponent } from '../note-form/note-form.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-member-notes',
    templateUrl: './member-notes.component.html',
    styleUrls: ['./member-notes.component.scss'],
    imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, TranslateModule]
})
export class MemberNotesComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() notes: Note[] = [];
  @Input() member: Member;
  dataSource: MatTableDataSource<Note>;
  displayedColumns: string[] = [
    'creationDate',
    'memberName',
    'importanceTypeName',
    'note',
    'createdByUserName',
    'edit',
    'dismiss',
    'delete'
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  width = screen.width;

  constructor(public dialog: MatDialog, private memberService: MemberService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.notes);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['notes'].firstChange) {
      this.dataSource = new MatTableDataSource(this.notes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNote() {
    let data = {} as dialogMemberData;
    data.type = 'addNote';
    data.memberData = this.member;
    let dialogRef = this.dialog.open(NoteFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }

  onDeleteNote(note: Note) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxHeight: '80vh',
      data: { mainTitle: this.translate.instant('members.msgToDeletedNote'), subTitle: `${note.note}` },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status === 'yes') {
        this.deleteNote(note.id);
      }
    });
  }

  deleteNote(noteId: number) {
    this.memberService.deleteNote(noteId).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.refresh.emit();
        }
      }
    })
  }

  editNote(note: Note) {
    let data = {} as dialogMemberNoteData;
    data.type = 'editNote';
    data.memberData = this.member;
    data.note = note;
    let dialogRef = this.dialog.open(NoteFormComponent, {
      maxHeight: '80vh',
      width: '700px',
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.status === 'success') {
        this.refresh.emit();
      }
    });
  }

  dismissNote(note: Note) {
    this.memberService.dismissNote(note.id).subscribe({
      next: (res) => {
        if (res.statusCode === 200) {
          this.refresh.emit();
        }
      }
    })
  }

}
