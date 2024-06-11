import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Hero } from '../hero';
import { Weapon } from '../weapon';
import { HerointerfaceService } from '../HeroInterfaceService';
import { WeaponInterfaceService } from '../weaponInterfaceService'
import { ApiServiceService, User } from '../api-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  heroes: Hero[] = [];
  weapons: Weapon[] = [];

  users: User[] = [];
  selected_user?: User = undefined;

  nbrHeroDashboard: number = 3;
  nbrWeaponDashboard: number = 3;
  

  constructor(
    
    private heroService: HerointerfaceService,
    private weaponService: WeaponInterfaceService,
    private apiService: ApiServiceService,
    private toastr: ToastrService,
  ) { }
  ngAfterViewInit(): void {

    
  
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      this.selected_user = JSON.parse(storedUser);
    }

    this.apiService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      error => {
        console.error('Erreur lors de la récupération des users :', error);
      }
    );
      
    this.getHeroes();
    this.getWeapons();
  }

  assignUser(){
    if(this.selected_user){
        localStorage.setItem('currentUser', JSON.stringify(this.selected_user));
        this.toastr.success(`User changed to ${this.selected_user.username}`);
    }
  }

  updateTop(){
    this.getHeroes();
    this.getWeapons();
  }

  getHeroes(): void {
    var selectElement = <HTMLSelectElement>document.getElementById("carac_id");
    var valeurSelectionnee = selectElement.value;
  
    
    this.heroService.getHeroes()
      .subscribe(heroes => {
        switch (valeurSelectionnee) {
          case 'attaque':
            this.heroes = heroes.sort((a, b) => b.stats[0] - a.stats[0]).slice(0, this.nbrHeroDashboard);
          break;
          case 'esquive':
            this.heroes = heroes.sort((a, b) => b.stats[1] - a.stats[1]).slice(0, this.nbrHeroDashboard);
          break;
          case 'degats':
            this.heroes = heroes.sort((a, b) => b.stats[2] - a.stats[2]).slice(0, this.nbrHeroDashboard);
          break;
          case 'pv':
            this.heroes = heroes.sort((a, b) => b.stats[3] - a.stats[3]).slice(0, this.nbrHeroDashboard);
          break;
        }
        
      });
  }

  getWeapons(): void{
    var selectElement = <HTMLSelectElement>document.getElementById("carac_id");
    var valeurSelectionnee = selectElement.value;
  
    
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        switch (valeurSelectionnee) {
          case 'attaque':
            this.weapons = weapons.sort((a, b) => b.attaque - a.attaque).slice(0, this.nbrWeaponDashboard);
          break;
          case 'esquive':
            this.weapons = weapons.sort((a, b) => b.esquive - a.esquive).slice(0, this.nbrWeaponDashboard);
          break;
          case 'degats':
            this.weapons = weapons.sort((a, b) => b.degats - a.degats).slice(0, this.nbrWeaponDashboard);
          break;
          case 'pv':
            this.weapons = weapons.sort((a, b) => b.pv - a.pv).slice(0, this.nbrWeaponDashboard);
          break;
        }
        
      });
  }
}