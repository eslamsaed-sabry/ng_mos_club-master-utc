import { Component, DestroyRef, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Gender, RECEIPTS_TYPES } from 'src/app/models/enums';
import { ICustomGymSetting, IGymSetting } from 'src/app/models/user.model';
import { AdministrationService } from 'src/app/services/administration.service';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignalRService } from 'src/app/services/signal-r.service';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
import { QRCodeComponent } from 'angularx-qrcode';
import { tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-gym-settings',
    templateUrl: './gym-settings.component.html',
    styleUrls: ['./gym-settings.component.scss'],
    imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule,
        MatRadioModule, MatFormFieldModule, MatSelectModule,
        MatOptionModule, MatInputModule, TranslateModule,
        MatDialogModule, SpinnerComponent, QRCodeComponent]
})
export class GymSettingsComponent implements OnInit {
  @ViewChild('whatsappQRModalRef') whatsappQRModalRef: TemplateRef<any>;
  receiptTypeConfig: any[] = [];
  gymSetting: ICustomGymSetting = {} as ICustomGymSetting;
  genders = Gender;
  gymSettings: IGymSetting[] = [];
  receiptTypes = RECEIPTS_TYPES;
  public appConfig = inject(AppConfigService);
  proxyUrl = this.appConfig.envUrl;
  dialog = inject(MatDialog);
  destroyRef = inject(DestroyRef);
  signalR = inject(SignalRService);
  private adminService = inject(AdministrationService);
  private toastr = inject(ToastrService);
  startWhatsapp$ = this.adminService.startWhatsappService().pipe(tap(() => {
    this.signalR.whatsappSignal('START');
  }));
  ngOnInit(): void {
    this.getGymSettings();
  }

  getGymSettings() {
    this.adminService.getGymSettings().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        let obj: any = {};
        this.gymSettings = res.data;
        this.gymSettings.forEach((el) => {
          obj[el.symbol] = el.value;
        });
        this.gymSetting = obj;
      }
    })
  }

  uploadImage(e: any) {

    let fieldName: string = e.target.name;
    let elem = e.target || e.srcElement;
    if (elem.files.length > 0) {
      let file = elem.files[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      ) {
        // File types supported for image
        if (file.size < 1000000) {
          const uploadData = new FormData();
          uploadData.append('Files', file);
          this.adminService
            .uploadImages(uploadData)
            .subscribe({
              next: (res: any) => {
                let obj: any = this.gymSetting;
                obj[fieldName] = '/Images/' + res.data[0];
                this.gymSetting = obj;
              },
              error: (error) => {
                this.toastr.error('Error', error.statusText);
                e.target.value = null;
              },
            });
        } else {
          e.target.value = null;
          this.toastr.error('Image size is too big', 'Sorry! image size exceeds 1mb');
        }
      }
    }
  }



  submit(form: NgForm) {
    this.gymSettings.forEach(el => {
      Object.entries(this.gymSetting).forEach(([k, v]) => {
        if (k === el.symbol) {
          el.value = v;
        }
      })
    });

    if (form.form.status === 'VALID') {
      this.adminService.editGymSettings(this.gymSettings).subscribe();
    }
  }



  openWhatsappDialog() {
    const dialogRef = this.dialog.open(this.whatsappQRModalRef, {
      width: '300px',
      autoFocus: false,
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(() => {
      this.signalR.whatsappSignal('STOP');
    })
  }
}
