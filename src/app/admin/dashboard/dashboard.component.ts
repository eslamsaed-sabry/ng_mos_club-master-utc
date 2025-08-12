import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TrainerOverviewComponent } from './trainer-overview/trainer-overview.component';
import { SalesOverviewComponent } from './sales-overview/sales-overview.component';
import { AnalyticsOverviewComponent } from './analytics-overview/analytics-overview.component';
import { MatIconModule } from '@angular/material/icon';
import { RoleDirective } from '../../directives/role.directive';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [
        MatTabsModule, RoleDirective, MatIconModule,
        AnalyticsOverviewComponent,SalesOverviewComponent,TrainerOverviewComponent, TranslateModule
    ]
})
export class DashboardComponent {
  selectedIndex: number = 0;
  selectTabName!:string;

  onChangeTab(tab:MatTabChangeEvent){
    this.selectTabName = tab.tab.ariaLabel;
  }
}
