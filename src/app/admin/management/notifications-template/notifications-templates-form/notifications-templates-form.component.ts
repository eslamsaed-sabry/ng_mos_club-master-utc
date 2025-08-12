import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogActions } from '@angular/material/dialog';
import { INotificationTemplate } from 'src/app/models/common.model';
import { CommonService } from 'src/app/services/common.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-notifications-templates-form',
    templateUrl: './notifications-templates-form.component.html',
    styleUrls: ['./notifications-templates-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatFormFieldModule, MatInputModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class NotificationsTemplatesFormComponent implements OnInit {
  @ViewChild('textArea') textArea: ElementRef;

  task: INotificationTemplate = {} as INotificationTemplate;
  availableData: any[] = [];
  copyTemplate: string;
  curPos: number | null;
  lastSelectedType: string;

  constructor(public dialogRef: MatDialogRef<NotificationsTemplatesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: INotificationTemplate, private common: CommonService) { }

  ngOnInit(): void {
    this.copyTemplate = this.data.template;
    this.getAvailableData();
  }

  getAvailableData() {
    this.availableData = this.data.availableData.split(',');
  }

  onChangeValue(type: string) {
    this.curPos = this.curPos != null ? this.curPos + this.lastSelectedType.length : this.textArea.nativeElement.selectionStart!;
    this.lastSelectedType = type;
    this.copyTemplate = this.copyTemplate.slice(0, this.curPos!) + type + this.copyTemplate.slice(this.curPos!);
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  submit() {
    this.data.template = this.copyTemplate;
    this.dismiss('success', this.data);
  }

}
