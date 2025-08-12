import { Component, effect, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-report-tabs',
  templateUrl: './report-tabs.component.html',
  styleUrls: ['./report-tabs.component.scss'],
  imports: [MatIconModule, NgClass]
})
export class ReportTabsComponent {
  tabs = input<string[]>([]);
  selectedIndex = 0;
  showNextBtn: boolean;
  showPrevBtn: boolean;
  tabsScroll: number;
  tabsVisible: number;
  scrollAmount: number = 0;
  maxScroll: number = 0;
  tabsElement: HTMLElement;
  isScrollable: boolean;

  constructor() {
    effect(() => {
      this.configureNavigation()
    })
  }


  onSelectTab(index: number, tabName: string) {
    this.selectedIndex = index;
    document.getElementById(tabName)!.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  configureNavigation() {
    this.tabsElement = document.getElementById('reports-tabs')!;
    this.tabsScroll = this.tabsElement.scrollWidth;
    this.tabsVisible = this.tabsElement.clientWidth;
    this.maxScroll = 0;
    if (this.tabsScroll > this.tabsVisible) {
      this.isScrollable = true;
      setTimeout(() => {
        this.showPrevBtn = true;
        this.showNextBtn = true;
      }, 200);
      this.maxScroll = this.tabsScroll - this.tabsVisible;
    } else {
      this.isScrollable = false;
      setTimeout(() => {
        this.showPrevBtn = false;
        this.showNextBtn = false;
      }, 200);
    }
  }

  goto(direction: string) {
    if (this.scrollAmount < 0) {
      this.scrollAmount = 0;
    } else if (this.scrollAmount > this.maxScroll) {
      this.scrollAmount = this.maxScroll
    }

    if (direction === 'next') {
      this.scrollAmount = this.scrollAmount + 100;
      this.tabsElement.scrollTo({ left: this.scrollAmount, behavior: 'smooth' });
    } else {
      this.scrollAmount = this.scrollAmount - 100;
      this.tabsElement.scrollTo({ left: this.scrollAmount, behavior: 'smooth' });

    }
  }

}
