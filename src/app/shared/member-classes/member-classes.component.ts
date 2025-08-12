import { Component, OnInit, Input, ViewChild, EventEmitter, Output, AfterViewInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Member } from 'src/app/models/member.model';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ISchedule } from 'src/app/models/schedule.model';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-member-classes',
    imports: [CommonModule, TranslateModule, RouterModule, MatIconModule, MatInputModule, MatTableModule, MatTooltipModule, MatPaginatorModule],
    templateUrl: './member-classes.component.html',
    styleUrl: './member-classes.component.scss'
})
export class MemberClassesComponent implements OnInit, AfterViewInit, OnChanges {
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() classes: ISchedule[] = [];
  @Input() member: Member;
  dataSource: MatTableDataSource<ISchedule>;
  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'instructorName',
    'classTypeName',
    'memberClassStatusName',
    'view',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  width = screen.width;
  dialog = inject(MatDialog)

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.classes);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['classes'].firstChange) {
      this.dataSource = new MatTableDataSource(this.classes);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
