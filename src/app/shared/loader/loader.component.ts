import { Component, OnInit } from '@angular/core';
import { CommonService, Loading } from 'src/app/services/common.service';


@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    imports: []
})
export class LoaderComponent implements OnInit {
  isLoading: boolean;

  constructor(private common:CommonService) { }

  ngOnInit(): void {
    this.common.isLoading.asObservable().subscribe((res:Loading)=>{
        setTimeout(() => {
          this.isLoading = res.show;
        }, 100);
    });
  }

}
