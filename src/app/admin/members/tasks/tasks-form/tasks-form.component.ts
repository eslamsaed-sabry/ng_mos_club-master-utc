import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SearchConfig } from 'src/app/models/common.model';
import { LookupType, Redirection, Theme } from 'src/app/models/enums';
import { ITasks, dialogTasksData } from 'src/app/models/extra.model';
import { Member } from 'src/app/models/member.model';
import { CommonService } from 'src/app/services/common.service';
import { MemberService } from 'src/app/services/member.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AdvancedSearchComponent } from '../../../../shared/advanced-search/advanced-search.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-tasks-form',
    templateUrl: './tasks-form.component.html',
    styleUrls: ['./tasks-form.component.scss'],
    imports: [MatDialogTitle, MatButtonModule, FormsModule, MatDialogContent, AdvancedSearchComponent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, TranslateModule]
})
export class TasksFormComponent implements OnInit {
  task: ITasks = {} as ITasks;
  tasks: any[] = [];
  sales: any[] = [];
  config: SearchConfig = {
    placeholder: this.translate.instant('common.topSearchPlaceholder'),
    redirectionType: Redirection.Monitoring,
    theme: Theme.Header
  };
  constructor(public dialogRef: MatDialogRef<TasksFormComponent>, private memberService: MemberService,
    @Inject(MAT_DIALOG_DATA) public data: dialogTasksData, private common: CommonService,
    private translate: TranslateService, private router: Router) { }

  ngOnInit(): void {
    this.getLookUps();
    if (this.data.type === 'add') {
      this.task.memberId = this.data.task?.memberId!;
    }
  }

  viewMemberTasks() {
    this.dismiss();
    this.router.navigate(['/admin/tasks'], {
      queryParams: {
        memberId: this.data.memberData.id,
        memberName: this.data.memberData.nameEng
      }
    })
  }


  getSelectedMember(member: Member) {
    this.data.memberData = member;
    this.task.memberId = member.id;
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  getLookUps() {
    this.common.getLookup(LookupType.Sales).subscribe({
      next: (res) => {
        this.sales = res;
      }
    })
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.memberService.addTask(this.task).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.memberService.addTask(this.task).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }

}
