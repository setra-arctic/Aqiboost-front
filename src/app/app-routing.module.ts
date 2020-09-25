import { SessionComponent } from './session/session.component';
import { SequenceComponent } from './sequence/sequence.component';
import { EspaceEnfantsComponent } from './espace-enfants/espace-enfants.component';
import { DataComponent } from './data/data.component';
import { InscriptionParentsComponent } from './inscription-parents/inscription-parents.component';
import { ExempleMatriceComponent } from './exemple-matrice/exemple-matrice.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { AjoutMatriceComponent } from './liste-matrices/ajout-matrice/ajout-matrice.component';
import { ListeMatricesComponent } from './liste-matrices/liste-matrices.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SyntheseVocaleComponent } from './synthese-vocale/synthese-vocale.component';
import { AqiboostMenuComponent } from './aqiboost-menu/aqiboost-menu.component';
import { ListeExercicesComponent } from './liste-exercices/liste-exercices.component';
import { FicheExerciceComponent } from './liste-exercices/fiche-exercice/fiche-exercice.component';
import { PopupDataExerciceComponent } from './liste-exercices/fiche-exercice/popup-data-exercice/popup-data-exercice.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/menu',
    pathMatch: 'full',
  },
  {
    path: 'menu',
    component: AqiboostMenuComponent,
  },
  {
    path: 'synth_vocale',
    component: SyntheseVocaleComponent,
  },
  {
    path: 'liste_matrices',
    component: ListeMatricesComponent,
  },
  {
    path: 'ajout_matrice/:id',
    component: AjoutMatriceComponent,
  },
  {
    path: 'list_users',
    component: ListUsersComponent,
  },
  {
    path: 'liste_base_exercices',
    component: ListeExercicesComponent,
  },
  {
    path: 'fiche_exercice/:id',
    component: FicheExerciceComponent,
  },
  {
    path: 'popup_data_exercice',
    component: PopupDataExerciceComponent,
  },
  {
    path: 'exemple_matrice/:id',
    component: ExempleMatriceComponent,
  },
  {
    path: 'inscription_parent/:id',
    component: InscriptionParentsComponent,
  },
  {
    path: 'data',
    component: DataComponent,
  },
  {
    path: 'enfant',
    component: EspaceEnfantsComponent,
  },
  {
    path: 'sequence',
    component: SequenceComponent,
  },
  {
    path: 'session',
    component: SessionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
