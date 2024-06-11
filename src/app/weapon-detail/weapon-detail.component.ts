import { Component, Input } from '@angular/core';
import { Weapon } from '../weapon';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { WeaponInterfaceService } from '../weaponInterfaceService';

import { FormControl, FormGroup } from '@angular/forms';
import { Hero } from '../hero';
import { HerointerfaceService } from '../HeroInterfaceService';

@Component({
  selector: 'app-weapon-detail',
  templateUrl: './weapon-detail.component.html',
  styleUrls: ['./weapon-detail.component.css']
})

export class WeaponDetailComponent {
  public attaque: FormControl = new FormControl(); 
  public esquive: FormControl = new FormControl();
  public degats: FormControl = new FormControl();
  public pv: FormControl = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private weaponService: WeaponInterfaceService,
    private heroService: HerointerfaceService,
    private location: Location,
  ) {}

  @Input() weapon?: Weapon;
  heroesHaveWeapon : Hero[] = []

  CaracGroup = new FormGroup({
    attaque: new FormControl(''),
    esquive: new FormControl(''),
    degats: new FormControl(''),
    pv: new FormControl('')
  });

  

  ngOnInit(): void {
    this.getWeapon();
    this.getHeroesWhoHaveWeapon()
  }
  
  getWeapon(): void {
    console.log("getWeapons")
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.weaponService.getWeapon(id)
      .subscribe(weapon => {
        this.weapon = weapon;
      });
  }
  

  getHeroesWhoHaveWeapon(){
    
    const id = String(this.route.snapshot.paramMap.get('id'));
    
      this.heroService.getHeroes()
      .subscribe(heroes => {
        this.heroesHaveWeapon = heroes.filter(hero => hero.weapon == String(id))
      });
    
   
  }
    
  

  goBack(): void {
    this.location.back();
  }

  checkAttaque(){
    if(this.attaque.value<-5)this.attaque.setValue(-5)
    if(this.attaque.value>5)this.attaque.setValue(5)

    
    
  }

  checkEsquive(){
    if(this.esquive.value<-5)this.esquive.setValue(-5)
    if(this.esquive.value>5)this.esquive.setValue(5)
    
  }

  checkDegats(){
    if(this.degats.value<-5)this.degats.setValue(-5)
    if(this.degats.value>5)this.degats.setValue(5)

    
  }

  checkPv(){
    if(this.pv.value<-5)this.pv.setValue(-5)
    if(this.pv.value>5)this.pv.setValue(5)


    
    
  }


  updateWeapon(){
    const id = String(this.route.snapshot.paramMap.get('id'));
    const weapon = this.weapon;
    if(weapon){
      this.weaponService.updateWeapon(weapon);
    }
  }

  calculateWeightWeapon() {
    let weightWeapon = 0;
  
    weightWeapon += this.attaque.value || 0;
    weightWeapon += this.esquive.value || 0;
    weightWeapon += this.degats.value || 0;
    weightWeapon += this.pv.value || 0;

    return weightWeapon;
  }
  
  

}
