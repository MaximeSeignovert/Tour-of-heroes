import { Component, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HerointerfaceService } from '../HeroInterfaceService';

import { FormControl, FormGroup } from '@angular/forms';
import { WeaponInterfaceService } from '../weaponInterfaceService';
import { Weapon } from '../weapon';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})

export class HeroDetailComponent {
  public attaqueFormControl: FormControl = new FormControl(); 
  public esquiveFormControl: FormControl = new FormControl();
  public degatsFormControl: FormControl = new FormControl();
  public pvFormControl: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private heroService: HerointerfaceService,
    private location: Location,
    private weaponService: WeaponInterfaceService,
  ) {}

  @Input() hero?: Hero;
  public weapon? : Weapon;
  public weapons? : Weapon[];
  public selectedWeapon? : Weapon;
  public updated : Boolean = true ;
  


  CaracGroup = new FormGroup({
    attaque: new FormControl(''),
    esquive: new FormControl(''),
    degats: new FormControl(''),
    pv: new FormControl('')
  });

  ngOnInit(): void {
    this.getHero();

  }
  
  getHero(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => {
        this.hero = hero;
        if (this.hero) {
          this.getWeaponHero();
          this.getWeapons();
        }
      });
  }

  getWeaponHero(){
    if(this.hero && this.hero.weapon!=""){
      this.weaponService.getWeapon(this.hero?.weapon)
      .subscribe(weapon => this.weapon = weapon);
    }
  }

  getWeapons(){
    this.weaponService.getWeapons()
    .subscribe(weapons => this.weapons = weapons);
  }

  updateHero(): void{
    const id = String(this.route.snapshot.paramMap.get('id'));
    
    this.calculateStatsHero();

    const hero = this.hero;
    if(hero){
      this.heroService.updateHero(hero);
      this.updated = true;
    }
  }

  goBack(): void {
    this.location.back();
  }

  checkAttaque(){
    if(this.attaqueFormControl.value<1)this.attaqueFormControl.setValue(1)
    let r = this.calculateRemainingCarac()
    if(r<0){
      this.attaqueFormControl.setValue(40 - (this.degatsFormControl.value + this.esquiveFormControl.value + this.pvFormControl.value));
    }
    this.updated = false;
  }

  checkEsquive(){
    if(this.esquiveFormControl.value<1)this.esquiveFormControl.setValue(1)
    let r = this.calculateRemainingCarac()
    if(r<0){
      this.esquiveFormControl.setValue(40 - (this.degatsFormControl.value + this.attaqueFormControl.value + this.pvFormControl.value));
    }
    this.updated = false;
  }

  checkDegats(){
    if(this.degatsFormControl.value<1)this.degatsFormControl.setValue(1)
    let r = this.calculateRemainingCarac()
    if(r<0){
      this.degatsFormControl.setValue(40 - (this.esquiveFormControl.value + this.attaqueFormControl.value + this.pvFormControl.value));
    }
    this.updated = false;
  }

  checkPv(){
    if(this.pvFormControl.value<1)this.pvFormControl.setValue(1)
    let r = this.calculateRemainingCarac()
    if(r<0){
      this.pvFormControl.setValue(40 - (this.esquiveFormControl.value + this.attaqueFormControl.value + this.degatsFormControl.value));
    }
    this.updated = false;
  }




  calculateRemainingCarac() {
    const totalCarac = 40; 
    let usedCarac = 0;
  
    usedCarac += this.attaqueFormControl.value || 0;
    usedCarac += this.esquiveFormControl.value || 0;
    usedCarac += this.degatsFormControl.value || 0;
    usedCarac += this.pvFormControl.value || 0;

    let result = totalCarac - usedCarac

    

    return result;
  }

  calculateStatsHero(){
    if(this.hero && this.hero.weaponStats.length==4){
      this.hero.stats = [
        this.hero.attributes[0] + this.hero.weaponStats[0], // att
        this.hero.attributes[1] + this.hero.weaponStats[1], // esq
        this.hero.attributes[2] + this.hero.weaponStats[2], // deg
        this.hero.attributes[3] + this.hero.weaponStats[3], // pv
      ]
    }else if(this.hero){
      this.hero.stats = [
        this.hero.attributes[0], // att
        this.hero.attributes[1], // esq
        this.hero.attributes[2], // deg
        this.hero.attributes[3], // pv
      ]
    }
    
  }
  
  ajouterArme(){
    if(this.hero && this.selectedWeapon){
      this.hero.weapon = String(this.selectedWeapon.id);
      this.hero.weaponStats = [this.selectedWeapon.attaque,this.selectedWeapon.esquive,this.selectedWeapon.degats,this.selectedWeapon.pv]
    }
    
    this.updateHero();
  }

  retirerArme(){
    if(this.hero && this.hero.weapon){
      this.hero.weapon = '';
      this.weapon = undefined;
    }
    this.updateHero();
  }

  canEquipWeapon(){
    
    if(this.hero && this.selectedWeapon){
      var a = this.hero.attributes[0] + this.selectedWeapon.attaque >= 1;
      var e = this.hero.attributes[1] + this.selectedWeapon.esquive >= 1; 
      var d = this.hero.attributes[2] + this.selectedWeapon.degats >= 1;
      var p = this.hero.attributes[3] + this.selectedWeapon.pv >= 1;
      
      return e && a && d && p;
    }else if(!this.selectedWeapon){
      return true; //Aucune arme sélectionnée
    }
    return false;
  }

  getUpdatedState(){
    if(this.isUpdated()){
      return "☑️";
    }else{
      return "🔄";
    }

  }
  isUpdated(){
    return this.updated;
  }
  

}
