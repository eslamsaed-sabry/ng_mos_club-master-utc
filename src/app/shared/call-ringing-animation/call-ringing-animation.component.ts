import { Component, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-call-ringing-animation',
    templateUrl: './call-ringing-animation.component.html',
    styleUrls: ['./call-ringing-animation.component.scss'],
    imports: [MatIconModule]
})
export class CallRingingAnimationComponent implements OnInit {
  @Input() iconName: string = 'phone';
  constructor() { }

  ngOnInit(): void {
  }

}
