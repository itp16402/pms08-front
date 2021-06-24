import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from '../auth.guard';
import {NgModule} from '@angular/core';
import {ProjectTableComponent} from './project-table/project-table.component';
import {HomeComponent} from './home/home.component';
import {AfterSelectedOrderComponent} from './after-selected-order/after-selected-order.component';
import {AcceptanceFirstStepComponent} from './statutory/acceptance/acceptance-first-step/acceptance-first-step.component';
import {BasicInfoComponent} from './statutory/acceptance/acceptance-first-step/basic-info/basic-info.component';
import {AcceptanceSecondStepComponent} from './statutory/acceptance/acceptance-second-step/acceptance-second-step.component';
import {EngagementTeamComponent} from './statutory/acceptance/acceptance-second-step/engagement-team/engagement-team.component';
import {EssentialSizeComponent} from './statutory/planning/planning-first-step/essential-size/essential-size.component';
import {PlanningFirstStepComponent} from './statutory/planning/planning-first-step/planning-first-step.component';
import {RegisterComponent} from "./register/register.component";
import {PlanningSecondStepComponent} from "./statutory/planning/planning-second-step/planning-second-step.component";
import {ImportantAccountsComponent} from "./statutory/planning/planning-second-step/important-accounts/important-accounts.component";

const routes: Routes = [

  // login
  {
    path: ':lang/login',
    component: LoginComponent
  },
  // setting as home page the login component
  {
    path: '',
    redirectTo: 'el/login',
    pathMatch: 'full'
  },
  {
    path: ':lang/register',
    component: RegisterComponent
  },
  {
    path: ':lang/projects',
    component: ProjectTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':lang/home/:id',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AfterSelectedOrderComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statutory/acceptance/acceptance-first-step',
        component: AcceptanceFirstStepComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statutory/acceptance/acceptance-first-step/1/:tableName',
        component: BasicInfoComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: ':lang/home/:id',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'statutory/acceptance/acceptance-second-step',
        component: AcceptanceSecondStepComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statutory/acceptance/acceptance-second-step/1/:tableName',
        component: EngagementTeamComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: ':lang/home/:id',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'statutory/planning/planning-first-step',
        component: PlanningFirstStepComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statutory/planning/planning-first-step/1/:tableName',
        component: EssentialSizeComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: ':lang/home/:id',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'statutory/planning/planning-second-step',
        component: PlanningSecondStepComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'statutory/planning/planning-second-step/1/:tableName',
        component: ImportantAccountsComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  {path: '**', redirectTo: 'el/login'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
