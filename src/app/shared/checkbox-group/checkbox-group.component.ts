import { Component, Input } from '@angular/core';
import { MatCheckboxDefaultOptions, MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY, MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from 'src/app/models/common.model';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-checkbox-group',
    templateUrl: './checkbox-group.component.html',
    styleUrls: ['./checkbox-group.component.scss'],
    providers: [
        { provide: MAT_CHECKBOX_DEFAULT_OPTIONS_FACTORY, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions }
    ],
    imports: [MatCheckboxModule, FormsModule]
})
export class CheckboxGroupComponent {
  @Input() task: Task = {} as Task;

  allComplete: boolean = true;

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
  }
}
