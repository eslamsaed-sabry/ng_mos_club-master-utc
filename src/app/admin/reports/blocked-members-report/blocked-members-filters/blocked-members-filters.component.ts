import { Component, Input, OnInit } from '@angular/core';
import { BlockedMembersFilters } from 'src/app/models/reports.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-blocked-members-filters',
    templateUrl: './blocked-members-filters.component.html',
    styleUrls: ['./blocked-members-filters.component.scss'],
    imports: [FormsModule, MatFormFieldModule, MatInputModule, TranslateModule]
})
export class BlockedMembersFiltersComponent implements OnInit {

  @Input() filters: BlockedMembersFilters;
  constructor() { }

  ngOnInit(): void {
  }



}
