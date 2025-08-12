import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RequiredFieldPage } from 'src/app/models/enums';
import { IPageField } from 'src/app/models/management.model';
import { ManagementService } from 'src/app/services/management.service';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-required-fields',
    templateUrl: './required-fields.component.html',
    styleUrls: ['./required-fields.component.scss'],
    imports: [NgClass, MatSlideToggleModule, FormsModule, TranslateModule]
})
export class RequiredFieldsComponent implements OnInit {
  pageTitle: string;
  pageName: RequiredFieldPage;
  fields: IPageField[] = [];
  constructor(private managementService: ManagementService, private route: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.pageTitle = this.translate.instant(this.route.snapshot.data['titleKey']);
    this.pageName = this.translate.instant(this.route.snapshot.data['pageName']);
    this.getPageFields();
  }


  getPageFields() {
    this.managementService.getPageFields(this.pageName).subscribe({
      next: (res: any) => {
        this.fields = res;
      }
    })
  }

  updateStatus(field: IPageField) {
    setTimeout(() => {
      this.managementService.editPageField(field).subscribe();
    }, 100);
  }

}
