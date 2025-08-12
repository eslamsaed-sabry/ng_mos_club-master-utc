
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageID } from 'src/app/models/enums';
import { dialogNewsData, INews } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-app-home-screen-sections-form',
  templateUrl: './app-home-screen-sections-form.component.html',
  styleUrl: './app-home-screen-sections-form.component.scss',
  imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, 
    MatDatepickerModule, MatDialogActions, MatButtonModule, TranslateModule, MatCheckboxModule]

})
export class NewsAppHomeScreenSectionsFormComponentFormComponent implements OnInit {
  news: INews = {} as INews;
  imageSrc: string;
  pageID = PageID;
  message: string;

  public dialogRef = inject(MatDialogRef<NewsAppHomeScreenSectionsFormComponentFormComponent>);
  public data = inject<dialogNewsData>(MAT_DIALOG_DATA);
  private managementService = inject(ManagementService);
  private translate = inject(TranslateService);
  appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;

  ngOnInit(): void {
    this.message = this.translate.instant("management.msgToCropImage");
    if (this.data.type === 'edit') {
      this.news = this.data.news;
      this.imageSrc = this.proxyUrl + this.data.news.imagePath;
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
