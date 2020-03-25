import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SummonerComponent } from './pages/summoner/summoner.component';


const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'summoner', component: SummonerComponent },
  { path: '**', pathMatch: 'full', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
