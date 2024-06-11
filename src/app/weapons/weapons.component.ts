import { Component, OnInit } from '@angular/core';

import { Weapon } from '../weapon';
import { WeaponInterfaceService } from '../weaponInterfaceService';

@Component({
  selector: 'app-weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css']
})
export class WeaponsComponent implements OnInit {
  weapons: Weapon[] = [];
  filteredWeapons : Weapon[] = [];
  termeRecherche : string = "";

  constructor(private weaponService: WeaponInterfaceService) { }

  ngOnInit(): void {
    this.getWeapons();
    this.getFilteredWeapons();
  }

  getWeapons(): void{
    var selectElement = <HTMLSelectElement>document.getElementById("carac_id");
    var valeurSelectionnee = selectElement.value;
  
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        switch (valeurSelectionnee) {
          case 'attaque':
            this.weapons = weapons.sort((a, b) => b.attaque - a.attaque);
          break;
          case 'esquive':
            this.weapons = weapons.sort((a, b) => b.esquive - a.esquive);
          break;
          case 'degats':
            this.weapons = weapons.sort((a, b) => b.degats - a.degats);
          break;
          case 'pv':
            this.weapons = weapons.sort((a, b) => b.pv - a.pv);
          break;
        }
        
      });

  }

  orderWeapons(){
    var selectElement = <HTMLSelectElement>document.getElementById("carac_id");
    var valeurSelectionnee = selectElement.value;
    
    switch (valeurSelectionnee) {
      case 'attaque':
        this.filteredWeapons = this.filteredWeapons.sort((a, b) => b.attaque - a.attaque);
      break;
      case 'esquive':
        this.filteredWeapons = this.filteredWeapons.sort((a, b) => b.esquive - a.esquive);
      break;
      case 'degats':
        this.filteredWeapons = this.filteredWeapons.sort((a, b) => b.degats - a.degats);
      break;
      case 'pv':
        this.filteredWeapons = this.filteredWeapons.sort((a, b) => b.pv - a.pv);
      break;
    }
        
      
    
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

  addNewWeapon(){
    const newWeapon: Weapon = {
      id: Number(this.generateId()), 
      name: this.newName(),
      attaque: Math.floor(Math.random() * 10)-5, 
      esquive: Math.floor(Math.random() * 10)-5,
      degats: Math.floor(Math.random() * 10)-5,
      pv: Math.floor(Math.random() * 10)-5,
    };

  this.weaponService.addWeapon(newWeapon);
  }

  deleteWeapon(id_hero: number){
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette arme ?');

    // Si l'utilisateur clique sur "OK" dans la boîte de dialogue
    if (confirmDelete) {
      this.weaponService.deleteWeapon(String(id_hero));
    }
    
  }

  getFilteredWeapons(){
    console.log("getFilteredWeapons")
    this.weaponService.getWeapons()
      .subscribe(weapons => {
        this.filteredWeapons = weapons.filter(weapon =>
          weapon.name.toLowerCase().includes(this.termeRecherche.toLowerCase())
        );
      });
  }

  newName(): string{
    if(this.termeRecherche==''){
      return 'Nouvelle Arme #'+Math.floor(Math.random() * 1000);
    }else{
      return this.termeRecherche;
    }
    
  }
}