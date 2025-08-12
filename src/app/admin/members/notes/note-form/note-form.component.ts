import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { dialogMemberNoteData, Note } from 'src/app/models/member.model';
import { MemberService } from 'src/app/services/member.service';
import { TranslateModule } from '@ngx-translate/core';

import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-note-form',
    templateUrl: './note-form.component.html',
    styleUrls: ['./note-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class NoteFormComponent implements OnInit {
  @Output('onSubmit') onSubmit = new EventEmitter();

  note: Note = {} as Note;
  constructor(public dialogRef: MatDialogRef<NoteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMemberNoteData, private memberService: MemberService) { }

  ngOnInit(): void {
    if (this.data.type === 'editNote') {
      this.note = this.data.note;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  addNote(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.note.memberId = this.data.memberData.id;
      this.memberService.addNote(this.note).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }
  editNote(f: NgForm) {
    if (f.form.status === 'VALID') {
      this.memberService.editNote(this.note).subscribe({
        next: (res) => {
          this.dismiss('success')
        }
      })
    }
  }

}
