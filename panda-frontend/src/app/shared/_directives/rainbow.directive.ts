import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appRainbow]'
})
export class RainbowDirective {

  constructor(public ref: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event:any) {
    console.log("1",event.target.value)
    this.ref.nativeElement.value = event.target.value.toUpperCase();
    this.ref.nativeElement.value = this.ref.nativeElement.value.toUpperCase();
    console.log("12",this.ref.nativeElement.value )
  }

 
}
