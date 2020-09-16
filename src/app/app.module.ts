import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SyntheseVocaleComponent } from './synthese-vocale/synthese-vocale.component';
import { AqiboostMenuComponent } from './aqiboost-menu/aqiboost-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListeMatricesComponent } from './liste-matrices/liste-matrices.component';
import { AjoutMatriceComponent } from './liste-matrices/ajout-matrice/ajout-matrice.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { FicheUserComponent } from './list-users/fiche-user/fiche-user.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListeExercicesComponent } from './liste-exercices/liste-exercices.component';
import { FicheExerciceComponent } from './liste-exercices/fiche-exercice/fiche-exercice.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopupDataExerciceComponent } from './liste-exercices/fiche-exercice/popup-data-exercice/popup-data-exercice.component';
import { ExempleMatriceComponent } from './exemple-matrice/exemple-matrice.component';
import { InscriptionParentsComponent } from './inscription-parents/inscription-parents.component';
import { ToastrModule } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AqiboostDialogComponent } from './aqiboost-dialog/aqiboost-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { DataComponent } from './data/data.component';
import { EspaceEnfantsComponent } from './espace-enfants/espace-enfants.component';
import { SequenceComponent } from './sequence/sequence.component';

@NgModule({
  declarations: [
    AppComponent,
    SyntheseVocaleComponent,
    AqiboostMenuComponent,
    ListeMatricesComponent,
    AjoutMatriceComponent,
    ListUsersComponent,
    FicheUserComponent,
    ListeExercicesComponent,
    FicheExerciceComponent,
    PopupDataExerciceComponent,
    ExempleMatriceComponent,
    InscriptionParentsComponent,
    AqiboostDialogComponent,
    DataComponent,
    EspaceEnfantsComponent,
    SequenceComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    ToastrModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
