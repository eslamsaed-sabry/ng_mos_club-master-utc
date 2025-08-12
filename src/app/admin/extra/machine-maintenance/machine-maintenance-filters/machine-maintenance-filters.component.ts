import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { LookupType } from 'src/app/models/enums';
import { MachineMaintenanceFilters } from 'src/app/models/extra.model';
import { CommonService } from 'src/app/services/common.service';
import { ExtraService } from 'src/app/services/extra.service';
import { MatButtonModule } from '@angular/material/button';

import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BidiModule } from '@angular/cdk/bidi';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-machine-maintenance-filters',
    templateUrl: './machine-maintenance-filters.component.html',
    styleUrls: ['./machine-maintenance-filters.component.scss'],
    imports: [FormsModule, BidiModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule, TranslateModule]
})
export class MachineMaintenanceFiltersComponent implements OnInit {
  @Input() filters: MachineMaintenanceFilters;
  @Output() onFilter: EventEmitter<any> = new EventEmitter();
  currentLang: string;
  machinesModels: any[] = [];
  locations: any[] = [];
  types: any[] = [];
  constructor(private common: CommonService, private translate: TranslateService, private extra: ExtraService) { }

  ngOnInit(): void {
    this.currentLang = this.translate.getDefaultLang();
    this.getLookUps();
  }

  getLookUps() {
    forkJoin([
      this.common.getLookup(LookupType.MachineModels),
      this.common.getLookup(LookupType.LocationsInsideGym),
      this.extra.getMachineMaintenanceTypes()
    ])
      .subscribe({
        next: ([machines, locations, types]) => {
          this.machinesModels = machines;
          this.locations = locations;
          this.types = types.data;
        }
      })
  }

}
