import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { PageID } from 'src/app/models/enums';
import { dialogNewsData, INews } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { environment } from '../../../../../environments/environment';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-news-form',
    templateUrl: './news-form.component.html',
    styleUrls: ['./news-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class NewsFormComponent implements OnInit {
  news: INews = {} as INews;
  imageSrc: string;
  pageID = PageID;
  message: string;

  constructor(public dialogRef: MatDialogRef<NewsFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogNewsData, private managementService: ManagementService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.message = this.translate.instant("management.msgToCropImage");
    if (this.data.type === 'edit') {
      this.news = this.data.news;
      this.imageSrc = environment.server + this.data.news.imagePath;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }

  handleInputChange(e: any) {
    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    let pattern = /image-*/;
    let reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e: any) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.news.imageBase64 = this.imageSrc;
    this.news.isImageChanged = true;
  }


  submit(form: NgForm) {
    this.news.typeId = this.data.utilityType;
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.news.eventDate = new Date();
        this.managementService.addNews(this.news, this.data.pageName.toLowerCase()).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      } else {
        this.managementService.editNews(this.news, this.data.pageName.toLowerCase()).subscribe({
          next: () => {
            this.dismiss('success');
          }
        })
      }
    }
  }

}
