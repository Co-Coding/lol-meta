import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SummonerComponent } from './pages/summoner/summoner.component';
import { DomseguroPipe } from './pipes/domseguro.pipe';
import { ChampionComponent } from './pages/champion/champion.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SummonerComponent,
    DomseguroPipe,
    ChampionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
