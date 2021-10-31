import { NgModule } from '@angular/core';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { ImageCaptureComponent } from '../utilities/image-capture/image-capture.component';
import { CandidateInteractionComponent } from './candidate-interaction/candidate-interaction.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { InteractionListComponent } from './interaction-list/interaction-list.component';
import { CandidateScreeningRoutingModule } from './candidate-screening-routing.module';
import { CandidateProfileService } from './candidate-profile/candidate-profile.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler } from '../utilities/error-handler/error-handler';
import { CandidateProfileListService } from './candidate-list/candidate-list.service';
import { CandidateInteractionListService } from './interaction-list/interaction-list.service';
import { CandidateInteractionService } from './candidate-interaction/candidate-interaction.service';
import { AuthGuard } from '../utilities/route-guards/auth-guard';

@NgModule({
  declarations: [
    ImageCaptureComponent,
    CandidateProfileComponent,
    CandidateInteractionComponent,
    CandidateListComponent,
    InteractionListComponent,
  ],
  imports: [
    CandidateScreeningRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    CandidateProfileService,
    CandidateProfileListService,
    CandidateInteractionListService,
    CandidateInteractionService,
    ErrorHandler,
    AuthGuard
  ],
  bootstrap: [],
})
export class CandidateScreeningModule { }
