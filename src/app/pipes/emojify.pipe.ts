import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emoji',
    standalone: true
})
export class EmojifyPipe implements PipeTransform {

  transform(value: string): string {
    if (value)
      return value.replace(/:-D/g, '😀').replace(/:-\)/g, '🙂').replace(/<3/,'❤️').
      replace(/\(y\)/,'👍').replace(/\(n\)/,'👎').replace(/:-\*/,'😘').replace(/:'\(/,'😢').
      replace(/;-\)/,'😉');
    else
      return ''
  }

}
