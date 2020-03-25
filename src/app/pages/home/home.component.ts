import { Component, OnInit } from '@angular/core';
import { SummonerService } from 'src/app/services/summoner.service';
import { Summoner } from '../models/summoner.model';
import { NgForm } from '@angular/forms';
import {  forkJoin, throwError } from 'rxjs';
import { tap, concatMap, map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  SummInfo:any = {};
  matchHistory = [] ;
  champImage = [];
  matchesArray = [];
  dataIdentities = [];
  dataParticipants = [];
  itemImage = [];
  clickIndex:number;
  click:boolean = false;
  show:boolean = false;
  cargando = false;
  gameDuration = [];
  index;
  region = [];

  summoner: Summoner = new Summoner

  constructor( private summ:SummonerService ) { 

    this.summoner.name = 'DBL NLSN'
    this.summoner.regionId = 'la2'
    this.region = [
      { region: 'la2' }, // LAS
      // { region: 'la1' }, 
      // { region: 'br1' }, 
      // { region: 'na1' }, 
      // { region: 'eun1' }, 
      // { region: 'euw1' }, 
    ]

  }

  ngOnInit() {
   
  }
  
  onSubmit(form:NgForm ){

    this.cargando = true;

    this.summ.getSummoner( this.summoner.name,this.summoner.regionId )
    .pipe( 
      tap( (summoner:any) => this.matchHistory = summoner.matchHistory ),
      catchError( err => {
        return throwError(err.error.message)
      }),
      concatMap( (summoner:any) => {
        const observables = [];
        this.matchHistory.map( element => observables.push(this.summ.getMatches(element.gameId)));
          return forkJoin(observables)
      }),
      map( (matchesArray:any) => {
        let gameIdArray = this.matchHistory.map( element => element.gameId)

        this.matchesArray = matchesArray.sort((a, b) => {  
          return gameIdArray.indexOf(a.gameId) - gameIdArray.indexOf(b.gameId);
        });
         return matchesArray
      }),
      concatMap( matchesArray => {   
        let vava = this.summ.getFork(matchesArray)
        return vava
      }),
      tap( (matchesArray:any) => {
        let dataParticipants = [];
        let itemImage = [];

        matchesArray.forEach( matches => {
          dataParticipants = matches.participants
        });
        
        this.dataParticipants = dataParticipants
        this.dataParticipants.forEach(  participant => {
          itemImage.push ( participant.stats.itemImage)
        })
        this.itemImage = itemImage
        
        console.log(this.dataParticipants);
        console.log(this.matchesArray);   
        
       }), 
       tap( (matchesArray) => {

        matchesArray.forEach( match =>{

          if ( match.summonerMatchInfo.stats.win === true ){
                match.summonerMatchInfo.stats.matchResult = 'Victory'
          }else{
                match.summonerMatchInfo.stats.matchResult = 'Defeat'
          }

          let hours = Math.floor(match.gameDuration / 60);  
          let minutes = match.gameDuration % 60;
        
          this.gameDuration.push(hours + ":" + minutes) 
          this.cargando = false; 
        });
       })
      )
           .subscribe( () => {}
           ,(error) => { 
             Swal.fire({
               icon: 'error',
               title: error
             });
             this.cargando = false;
           });
      
    
  }

  openMatchStats(index,mat){ 
    this.index = index
    mat.show = mat.show  ? false : true;
  };



}
