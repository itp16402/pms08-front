import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import {CoreRoutingModule} from './core-routing.module';
import {AuthGuard} from '../auth.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

import {DemoMaterialModule} from '../demo-material-module';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ProjectTableComponent } from './project-table/project-table.component';
import {LoginComponent} from './login/login.component';
import { AfterSelectedOrderComponent } from './after-selected-order/after-selected-order.component';
import {AcceptanceFirstStepComponent} from './statutory/acceptance/acceptance-first-step/acceptance-first-step.component';
import {BasicInfoComponent} from './statutory/acceptance/acceptance-first-step/basic-info/basic-info.component';
import {AcceptanceSecondStepComponent} from './statutory/acceptance/acceptance-second-step/acceptance-second-step.component';
import {EngagementTeamComponent} from './statutory/acceptance/acceptance-second-step/engagement-team/engagement-team.component';
import {PlanningFirstStepComponent} from './statutory/planning/planning-first-step/planning-first-step.component';
import {CustomProgressComponent} from '../shared/shared-componets/custom-progress/custom-progress.component';
import {NgxDropzoneModule} from 'ngx-dropzone';
import { DeleteMemberComponent } from './statutory/acceptance/acceptance-second-step/engagement-team/delete-member/delete-member.component';
import {AssignFormsToMemberComponent} from './statutory/acceptance/acceptance-second-step/engagement-team/assign-forms-to-member/assign-forms-to-member.component';
import { EssentialSizeComponent } from './statutory/planning/planning-first-step/essential-size/essential-size.component';
import {CustomFormsModule} from 'ngx-custom-validators';
import { RegisterComponent } from './register/register.component';
import { PlanningSecondStepComponent } from './statutory/planning/planning-second-step/planning-second-step.component';
import { ImportantAccountsComponent } from './statutory/planning/planning-second-step/important-accounts/important-accounts.component';
import { OpenFormFieldsComponent } from './open-form-fields/open-form-fields.component';
import { RegisterDialogComponent } from './register/register-dialog/register-dialog.component';
import { CompleteModalComponent } from './statutory/planning/planning-second-step/important-accounts/complete-modal/complete-modal.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    ProjectTableComponent,
    LoginComponent,
    AfterSelectedOrderComponent,
    AcceptanceFirstStepComponent,
    BasicInfoComponent,
    AcceptanceSecondStepComponent,
    EngagementTeamComponent,
    PlanningFirstStepComponent,
    CustomProgressComponent,
    DeleteMemberComponent,
    AssignFormsToMemberComponent,
    EssentialSizeComponent,
    RegisterComponent,
    PlanningSecondStepComponent,
    ImportantAccountsComponent,
    OpenFormFieldsComponent,
    RegisterDialogComponent,
    CompleteModalComponent,
  ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        CoreRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        SharedModule,
        PerfectScrollbarModule,
        FlexLayoutModule,
        DemoMaterialModule,
        NgxDropzoneModule,
        CustomFormsModule
    ],
    exports: [
        HomeComponent,
        NavbarComponent
    ],
  providers: [
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class CoreModule { }
