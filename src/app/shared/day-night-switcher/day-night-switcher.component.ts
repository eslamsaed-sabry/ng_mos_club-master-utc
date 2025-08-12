import { Component, OnInit, inject } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-day-night-switcher',
    templateUrl: './day-night-switcher.component.html',
    styleUrls: ['./day-night-switcher.component.scss'],
    imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
]
})
export class DayNightSwitcherComponent implements OnInit {
  toggler: boolean;
  currentTheme: string = localStorage.getItem('theme') || '';
  private common = inject(CommonService);

  ngOnInit(): void {
    if (this.currentTheme === 'dark-theme') {
      this.toggler = true;
      this.onSwitch();
    } else {
      this.onSwitch();
    }
  }

  onSwitch() {
    // true = night .. false = day
    if (this.toggler) {
      document.body.id = 'dark-theme';
      localStorage.setItem('theme', 'dark-theme');
      this.common.updateTheme({ theme: 'dark-theme' });
    } else {
      document.body.id = 'light-theme';
      localStorage.setItem('theme', 'light-theme');
      this.common.updateTheme({ theme: 'light-theme' });
    }
  }

}
