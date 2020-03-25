import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SummonerService {

  constructor( private http:HttpClient ) { }

  summonerName
  dataMatch
  matchParticipants
  matchHistory = [];
  summoner

  matchesArray

    getSummoner(summonerName,regionId){
    this.summonerName = summonerName
   return this.http.get(`https://lolmeta-backend.herokuapp.com/summName/${summonerName}/${regionId}` )
  };

   getChampImage(champId){
     return this.http.get(`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${champId}.png`)
   };

   getMatches(gameId){
     return this.http.get( `https://lolmeta-backend.herokuapp.com/match/${gameId}`)
     .pipe(
       map( (data:any) => {
         return data.match 
        })
     )
    };

    
   
    
    getFork(matchesArray){
      this.matchesArray = matchesArray
      return forkJoin(
        this.getSpells(),
        this.getChampData(),
        this.getItems(),
        this.getPerks()
      ).pipe(
        map( (data:any) => { 

            // Get and Set Image for Items
              this.matchesArray.forEach( x => {
                let matchParticipants = x.participants
          
                matchParticipants.forEach( participants => {
                 const participant = participants
                  
                 let itemsId0 = participants.stats.item0
                 let itemsId1 = participants.stats.item1
                 let itemsId2 = participants.stats.item2
                 let itemsId3 = participants.stats.item3
                 let itemsId4 = participants.stats.item4
                 let itemsId5 = participants.stats.item5
                 let itemsId6 = participants.stats.item6
           
                 let itemsImage0 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId0}.png`
                 let itemsImage1 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId1}.png`
                 let itemsImage2 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId2}.png`
                 let itemsImage3 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId3}.png`
                 let itemsImage4 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId4}.png`
                 let itemsImage5 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId5}.png`
                 let itemsImage6 = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/item/${itemsId6}.png`
           
                  participant.stats.itemImage = [itemsImage0 ,itemsImage1 ,itemsImage2 , itemsImage3, itemsImage4,itemsImage5 , itemsImage6]
           
                 participant.championIdImage = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${participant.championId}.png`
  

            // Get and Set spells data and Image
            
                let spellsObj = data[0].spells.spells.data;
                const spellsArray:Array<any>[] = [];

                Object.keys(spellsObj).forEach( key =>{
                  let spell = spellsObj[key]
                  spellsArray.push(spell)
                });
  
                let spellId1:any = spellsArray.find( (spell:any) => spell.key === JSON.stringify(participants.spell1Id) );
                let spellId2:any = spellsArray.find( (spell:any) => spell.key === JSON.stringify(participants.spell2Id) );
      
                  let spellId1Image = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/spell/${spellId1.id}.png`
                  let spellId2Image = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/spell/${spellId2.id}.png`
        
                    participants.spellId1Info = spellId1
                    participants.spellId2Info = spellId2
          
                    participants.spellId1Info.image = spellId1Image
                    participants.spellId2Info.image = spellId2Image


            // Champ data 
      
              let dataChampsObj = data[1].Champs.bodyChamps
              const champsArray:Array<any>[] = [];
      
                Object.keys(dataChampsObj).forEach( key => {
                  let champ = dataChampsObj[key]
                  champsArray.push(champ)
                });
      
                let championInfo = champsArray.find( (champ:any) => champ.id === participants.championId )
                participants.champInfo = championInfo

            // Get Items Info
                
                  let itemsDataObj = data[2].items.items.data
                  const itemsArray:Array<any>[] = [];
          
                  Object.keys(itemsDataObj).forEach( key => {
                    let item = itemsDataObj[key]
                    item.key = JSON.parse(key)
                    itemsArray.push(item)
                  });       
          
                     let itemInfo0 = itemsArray.find ( (item:any) => item.key === participants.stats.item0  ) 
                     let itemInfo1 = itemsArray.find ( (item:any) => item.key === participants.stats.item1  )
                     let itemInfo2 = itemsArray.find ( (item:any) => item.key === participants.stats.item2  )
                     let itemInfo3 = itemsArray.find ( (item:any) => item.key === participants.stats.item3  )
                     let itemInfo4 = itemsArray.find ( (item:any) => item.key === participants.stats.item4  )
                     let itemInfo5 = itemsArray.find ( (item:any) => item.key === participants.stats.item5  )
                     let itemInfo6 = itemsArray.find ( (item:any) => item.key === participants.stats.item6  )
          
                     participants.stats.itemInfo = [itemInfo0,itemInfo1,itemInfo2,itemInfo3,itemInfo4,itemInfo5,itemInfo6 ]
                    
            // Get Perks

                  let perksData = data[3].data.perks;
                  let perkData = perksData.find( (perk:any) => perk.id === participant.stats.perkPrimaryStyle )
                    participant.stats.perkData = perkData
                    participant.stats.perkData.image = `http://ddragon.canisback.com/img/`+ participant.stats.perkData.icon
    
              }); 
            }); 

            //Get and Set data for every summoner
              this.matchesArray.forEach( match => {      
                let participantIdArray = match.participantIdentities
                let indexParticipant = participantIdArray.findIndex( element => element.player.summonerName.toLowerCase() === this.summonerName.toLowerCase())
                
                  match.summonerMatchInfo = match.participants[indexParticipant]
                  match.summonerInfo = match.participantIdentities[indexParticipant].player
              });

          return this.matchesArray
        })
      )
    }
     
    getSpells(){   
      return this.http.get(`https://lolmeta-backend.herokuapp.com/spells`)     
    }
    
    getChampData(){
      return this.http.get( `https://lolmeta-backend.herokuapp.com/championsdata` )
    }
    
    getItems(){
      return this.http.get('https://lolmeta-backend.herokuapp.com/items')
    }
    getPerks(){
      return this.http.get('https://lolmeta-backend.herokuapp.com/perks')
    }

    

}



