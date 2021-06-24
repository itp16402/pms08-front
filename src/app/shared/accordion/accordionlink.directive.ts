import {
  Directive,
  HostBinding,
  Inject,
  Input,
  OnInit,
  OnDestroy
} from '@angular/core';

import { AccordionDirective } from './accordion.directive';

@Directive({
  selector: '[appAccordionLink]'
})
export class AccordionLinkDirective implements OnInit, OnDestroy {
  @Input()
  public group: any;

  @HostBinding('class.selected')
  @Input()
  // @ts-ignore
  get selected(): boolean {
    return this._selected;
  }
  // @ts-ignore
  set selected(value: boolean) {
    this._selected = value;
    if (value) {
      this.nav.closeOtherLinks(this);
    }
  }
  // tslint:disable-next-line:variable-name
  protected _selected = false;
  protected nav: AccordionDirective;

  constructor(@Inject(AccordionDirective) nav: AccordionDirective) {
    this.nav = nav;
  }

  ngOnInit(): any {
    this.nav.addLink(this);
  }

  ngOnDestroy(): any {
    this.nav.removeGroup(this);
  }

  toggle(): any {
    this.selected = !this.selected;
  }
}
