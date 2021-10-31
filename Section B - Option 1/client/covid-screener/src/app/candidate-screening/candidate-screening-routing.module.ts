import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { CandidateInteractionComponent } from './candidate-interaction/candidate-interaction.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { InteractionListComponent } from './interaction-list/interaction-list.component';
import { AuthGuard } from '../utilities/route-guards/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: CandidateListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile/:id',
    component: CandidateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: CandidateProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'interaction/:profileId',
    component: CandidateInteractionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'interaction/:profileId/:id',
    component: CandidateInteractionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'interaction-list/:id',
    component: InteractionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'interaction-list',
    component: InteractionListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile-list',
    component: CandidateListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/contact/profile-list'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidateScreeningRoutingModule { }
