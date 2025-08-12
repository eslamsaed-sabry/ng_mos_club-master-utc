import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { forkJoin } from 'rxjs';
import { LookupType } from 'src/app/models/enums';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { ManagementService } from 'src/app/services/management.service';
import { dialogMachineData, IMachine } from 'src/app/models/management.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
    selector: 'app-machine-form',
    templateUrl: './machine-form.component.html',
    styleUrls: ['./machine-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatCheckboxModule, MatDialogActions, MatButtonModule, TranslateModule]
})
export class MachineFormComponent implements OnInit {
  machine: IMachine = {} as IMachine;
  @ViewChild('foundByModal') foundByModal: TemplateRef<any>;
  machinesModels: any[] = [];
  locations: any[] = [];

  constructor(public dialogRef: MatDialogRef<MachineFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogMachineData, private managementService: ManagementService, private common: CommonService) { }

  ngOnInit(): void {
    this.getLookUps();
    if (this.data.type === 'edit') {
      this.machine = this.data.machine!;
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  getLookUps() {
    forkJoin([
      this.common.getLookup(LookupType.MachineModels),
      this.common.getLookup(LookupType.LocationsInsideGym),
    ])
      .subscribe({
        next: ([machines, locations]) => {
          this.machinesModels = machines;
          this.locations = locations;
        }
      })
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.managementService.addMachine(this.machine).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.managementService.editMachine(this.machine).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }

}
