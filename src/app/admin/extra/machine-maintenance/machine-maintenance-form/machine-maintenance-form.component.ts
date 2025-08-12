import { Component, OnInit, Inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { NgForm, FormsModule } from '@angular/forms';
import { ExtraService } from 'src/app/services/extra.service';
import { dialogMachineMaintenanceData, IMachineMaintenance } from 'src/app/models/extra.model';
import { ManagementService } from 'src/app/services/management.service';
import { MachinesFilters } from 'src/app/models/management.model';
import moment from 'moment';
import { StandardDatePipe } from 'src/app/pipes/standard-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LookupType } from 'src/app/models/enums';
import { MemberService } from 'src/app/services/member.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
    selector: 'app-machine-maintenance-form',
    templateUrl: './machine-maintenance-form.component.html',
    styleUrls: ['./machine-maintenance-form.component.scss'],
    imports: [MatDialogTitle, FormsModule, MatDialogContent, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatDialogActions, MatButtonModule, TranslateModule],
    providers: [ExtraService]
})
export class MachineMaintenanceFormComponent implements OnInit {
  maintenance: IMachineMaintenance = {} as IMachineMaintenance;
  machines: any[] = [];
  maintenanceTypes: any[] = [];

  constructor(public dialogRef: MatDialogRef<MachineMaintenanceFormComponent>, private managementService: ManagementService,
    @Inject(MAT_DIALOG_DATA) public data: dialogMachineMaintenanceData, private extra: ExtraService, private common: CommonService,
    private standardDate: StandardDatePipe) { }

  ngOnInit(): void {
    this.getLookUps();
    if (this.data.type === 'edit') {
      this.maintenance = this.data.machineMaintenance!;
      this.maintenance.maintenanceDate = moment(this.maintenance.maintenanceDate).format('YYYY-MM-DD') + 'T' + moment(this.maintenance.maintenanceDate).format('HH:mm');
    }
    else {
      this.maintenance.maintenanceDate = moment(new Date()).format('YYYY-MM-DD') + 'T' + moment(new Date()).format('HH:mm');
    }
  }

  dismiss(status: string = 'cancelled', data: any = null): void {
    this.dialogRef.close({ status: status, data: data });
  }


  getLookUps() {
    let filters: MachinesFilters = new MachinesFilters();
    forkJoin([
      this.managementService.getMachines(filters),
      this.common.getLookup(LookupType.MaintenanceTypes),
    ])
      .subscribe({
        next: ([machines, maintenanceTypes]) => {
          this.machines = machines.data;
          this.maintenanceTypes = maintenanceTypes;
        }
      })
  }

  submit(form: NgForm) {
    if (form.form.status === 'VALID') {
      if (this.data.type === 'add') {
        this.extra.addMachineMaintenance(this.maintenance).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      } else {
        this.extra.editMachineMaintenance(this.maintenance).subscribe({
          next: (res) => {
            this.dismiss('success');
          }
        });
      }
    }
  }

}
