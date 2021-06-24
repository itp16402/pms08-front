import {
  AccordionAnchorDirective,
  AccordionLinkDirective,
  AccordionDirective
} from './accordion';
import {NgModule} from '@angular/core';
import {DemoMaterialModule} from '../demo-material-module';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective

  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  imports: [
    DemoMaterialModule,
    CommonModule
  ],
  providers: []
})
export class SharedModule {}
