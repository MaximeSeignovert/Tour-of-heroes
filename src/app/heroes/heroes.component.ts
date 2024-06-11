import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HerointerfaceService } from '../HeroInterfaceService';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Hero[] = [];
  filteredHeroes : Hero[] = [];
  termeRecherche: string = '';

  constructor(private heroService: HerointerfaceService) { }

  ngOnInit(): void {
    this.getHeroes();
    this.getFilteredHeroes();
    this.orderHeroes();
  }

  getHeroes(): void {
    
    var selectElement = <HTMLSelectElement>document.getElementById("carac_id");
    var valeurSelectionnee = selectElement.value;

    
    this.heroService.getHeroes()
      .subscribe(heroes => {
        switch (valeurSelectionnee) {
          case 'attaque':
            this.heroes = heroes.sort((a, b) => b.stats[0] - a.stats[0]);
          break;
          case 'esquive':
            this.heroes = heroes.sort((a, b) => b.stats[1] - a.stats[1]);
          break;
          case 'degats':
            this.heroes = heroes.sort((a, b) => b.stats[2] - a.stats[2]);
          break;
          case 'pv':
            this.heroes = heroes.sort((a, b) => b.stats[3] - a.stats[3]);
          break;
        }
        
      });
      

  }

  getFilteredHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => {
        this.filteredHeroes = heroes.filter(hero =>
          hero.name.toLowerCase().includes(this.termeRecherche.toLowerCase())
        );
      });
  }

  generateId(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let chaineAleatoire = '';

    for (let i = 0; i < 20; i++) {
        const indiceAleatoire = Math.floor(Math.random() * caracteres.length);
        chaineAleatoire += caracteres.charAt(indiceAleatoire);
    }

    return chaineAleatoire;
}


  addNewHero(){
    const startAttributes = [Math.ceil(Math.random() * 10),Math.ceil(Math.random() * 10),Math.ceil(Math.random() * 10),Math.ceil(Math.random() * 10)];
    const newHero: Hero = {
      id: Number(this.generateId()), 
      name: this.newName(),
      weapon: "", 
      attributes: startAttributes,
      weaponStats: [0,0,0,0],
      stats: startAttributes
    };

  this.heroService.addHero(newHero);
  }

  deleteHero(id_hero: number){
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer ce héros ?');

    // Si l'utilisateur clique sur "OK" dans la boîte de dialogue
    if (confirmDelete) {
      this.heroService.deleteHero(String(id_hero));
    }
  }

  orderHeroes(){
    var selectElement = <HTMLSelectElement>document.getElementById("carac_id");
    var valeurSelectionnee = selectElement.value;
    
    switch (valeurSelectionnee) {
      case 'attaque':
        this.filteredHeroes = this.filteredHeroes.sort((a, b) => b.stats[0] - a.stats[0]);
      break;
      case 'esquive':
        this.filteredHeroes = this.filteredHeroes.sort((a, b) => b.stats[1] - a.stats[1]);
      break;
      case 'degats':
        this.filteredHeroes = this.filteredHeroes.sort((a, b) => b.stats[2] - a.stats[2]);
      break;
      case 'pv':
        this.filteredHeroes = this.filteredHeroes.sort((a, b) => b.stats[3] - a.stats[3]);
      break;
    }
        
      
    
  }

  newName(): string{
    if(this.termeRecherche==''){
      return 'Nouveau Héros #'+Math.floor(Math.random() * 1000);
    }else{
      return this.termeRecherche;
    }
    
  }

}