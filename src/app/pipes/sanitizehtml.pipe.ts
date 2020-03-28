import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml  } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizehtml'
})
export class SanitizehtmlPipe implements PipeTransform {

  constructor( private domSanitizer: DomSanitizer){}

  transform(value: any, ...args: any[]): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustHtml( value );
  }

}
