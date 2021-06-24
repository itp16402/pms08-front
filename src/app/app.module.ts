import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SpinnerComponent} from "./shared/spinner.component";
import {DeleteModalComponent} from "./shared/shared-componets/delete-modal/delete-modal.component";
import {EditAcceptanceComponent} from "./shared/shared-componets/edit-acceptance/edit-acceptance.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreModule} from "./core/core.module";
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {DemoMaterialModule} from "./demo-material-module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {SharedModule} from "./shared/shared.module";
import {ToastrModule} from "ngx-toastr";
import {JwtInterceptor} from "./shared/Injectables/Interceptor/jwt-interceptor";
import {AuthGuard} from "./auth.guard";
import {ResponsePeelerInterceptorService} from "./shared/Injectables/Interceptor/response-peeler-interceptor.service";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    EditAcceptanceComponent,
    DeleteModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    HttpClientModule,
    CoreModule,
    SharedModule,

    AppRoutingModule,
    ToastrModule.forRoot({
      preventDuplicates: true
    }),
    ReactiveFormsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {provide: HTTP_INTERCEPTORS, useClass: ResponsePeelerInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
