import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HerointerfaceService } from '../HeroInterfaceService';
import { WeaponInterfaceService } from '../weaponInterfaceService';
import { Hero } from '../hero';
import { MessageService } from '../message.service';
import { FightState } from '../fightState';
import { ApiServiceService } from '../api-service.service';
import { User } from '../api-service.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-arena',
  templateUrl: './arena.component.html',
  styleUrls: ['./arena.component.css']
})
export class ArenaComponent implements OnInit{
  constructor(
    private route: ActivatedRoute,
    private heroService: HerointerfaceService,
    private location: Location,
    private weaponService: WeaponInterfaceService,
    public messageService : MessageService,
    private apiService : ApiServiceService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getHeroes();
    this.messageService.clear()
    
  }
  public FightState = FightState;
  public selected_player1_hero?: Hero;
  public player1?: Hero;

  public selected_player2_hero?: Hero;
  public player2?: Hero;

  public heroes?: Hero[] = [];
  public selectableHeroes: Hero[] = [];

  public fightIntervalId: ReturnType<typeof setInterval> | undefined;
  public fightState : FightState = FightState.selection;

  goBack(): void {
    this.location.back();
    this.messageService.clear()
  }

  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = this.selectableHeroes = heroes);
  }

  updateSelectableListHeroes(){
    if(this.heroes){
      this.selectableHeroes = this.heroes.filter(hero => hero !== this.player1 && hero !== this.player2);
    }

  }

  selectPlayer1(){
    this.player1 = this.selected_player1_hero;
    this.updateSelectableListHeroes();
    this.selected_player1_hero = undefined;
    this.selected_player2_hero = undefined;
  }

  selectPlayer2(){
    this.player2 = this.selected_player2_hero;
    this.updateSelectableListHeroes();
    this.selected_player1_hero = undefined;
    this.selected_player2_hero = undefined;
  }


  fight(): void {
    this.fightState = FightState.fight;
    if (this.player1 && this.player2) {
      this.messageService.push(this.player1.name + "⚔️" + this.player2.name);
      var numTurn = 0;
      this.fightIntervalId = setInterval(() => {
        numTurn++;
        this.newTurn(numTurn);
        if (this.player1 && this.player2) {
          if (this.player1.stats[3] <= 0 || this.player2.stats[3] <= 0) {
            this.victory()
            clearInterval(this.fightIntervalId);
          }
        }
      }, 1000); // Répéte toutes les secondes
    }
  }

  stopFight(){
    clearInterval(this.fightIntervalId);
    this.fightState = FightState.end;
    this.messageService.push("Combat arrêté");
  }
  
  newTurn(numTurn: number ): void {
    if (this.player1 && this.player2) {
      if(numTurn%2==0){
        if(this.player1.stats[0] * this.rollTheDice(6) > this.player2.stats[1] * this.rollTheDice(6)){
          this.player2.stats[3] -= this.player1.stats[2];
          this.messageService.push(this.player1.name+" inflige "+this.player1.stats[2]+" à "+this.player2.name);
        }else{
          this.messageService.push(this.player2.name+" esquive l'attaque de "+this.player1.name);
        }
      }else{
        if(this.player2.stats[0] * this.rollTheDice(6) > this.player1.stats[1] * this.rollTheDice(6)){
          this.player1.stats[3] -= this.player2.stats[2];
          this.messageService.push(this.player2.name+" inflige "+this.player2.stats[2]+" à "+this.player1.name);
        }else{
          this.messageService.push(this.player1.name+" esquive l'attaque de "+this.player2.name);
        }
      }
      
    }
    
  }

  victory(){
    this.fightState = FightState.end;
    const reward = Math.floor(Math.random() * 50)+20;
    this.wonMoney(reward)
    if(this.player1 && this.player2){
      if(this.player2.stats[3] <= 0){
        this.messageService.push(this.player1.name+" a gagné 🏆");
      }else if(this.player1.stats[3] <= 0){
        this.messageService.push(this.player2.name+" a gagné 🏆");
      }
    }
  }

  rollTheDice(sides:number){
    return Math.floor(Math.random() * sides) + 1;
  }

  getBarreDeVie(nbrVie : number){
    if(nbrVie>0){
      return '▓'.repeat(nbrVie);
    }else{
      return "X"
    }
    
  }

  retry(){
    // Recoommencer un match
    window.location.reload();
  }

  wonMoney(amount : number){
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      const currentUser = JSON.parse(storedUser);
      currentUser.coins += amount
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.apiService.updateUser(currentUser);
      this.toastr.success(`${currentUser.username} has won ${amount}🪙`);
    }  
  }
  
  
}
