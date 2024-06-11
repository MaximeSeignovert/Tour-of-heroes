import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Weapon } from '../weapon';
import { WeaponInterfaceService } from '../weaponInterfaceService';
import { ApiServiceService, User, Product, Order, Categorie } from '../api-service.service';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})


export class ShopComponent implements OnInit{

  serverStatus: Boolean | undefined;

  user : User | undefined;
  listProduit : Product[] | undefined;
  orders : Order[] | undefined;
  categories : Categorie[] | undefined;
  

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private apiService: ApiServiceService,
    private toastr: ToastrService,
    private weaponService: WeaponInterfaceService,
  ) {}

  ngOnInit(): void {

    this.apiService.pingServer().subscribe(
      (data: Boolean) => {
        this.serverStatus = data;
      },
      error => {
        console.error('Erreur lors de la récupération de l\'user :', error);
      }
    );

    this.updateListeProduits()
    this.updateCategories()

    
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    this.getHistory();

  }

  goBack(): void {
    this.location.back();
  }


  buyProduct(id: number): void {
    console.log("Achat product",id)
    this.apiService.getProduct(id).subscribe(
      (data: Product) => {

        const newWeapon: Weapon = {
          id: data.id,
          name: data.name,
          attaque: data.stats.attaque, 
          esquive: data.stats.esquive, 
          degats: data.stats.degats, 
          pv: data.stats.pv,
        };
        console.log(newWeapon)
        this.buy(data.price);
        this.weaponService.addWeapon(newWeapon);
        this.apiService.deleteProduct(id).subscribe(
          (data: Object) => {
            this.toastr.success(`Product #${id} bought`);
            this.updateListeProduits();        
          },
          error => {
            console.error('Erreur lors de la récupération de l\'user :', error);
          }
        );
      },
      error => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  addWeapon(){
    let newid = Math.floor(Math.random()*1000);
    const newName = this.getNewWeaponName();
    let newWeapon : Product = {
      id : newid,
      name: newName,
      stats: {
          pv: Math.floor(Math.random()*10)-5,
          esquive:Math.floor(Math.random()*10)-5,
          attaque:Math.floor(Math.random()*10)-5,
          degats:Math.floor(Math.random()*10)-5,
      },
      price: Math.floor(Math.random()*20)+10,
      categoryId: this.getWeaponCategorie(newName),
    };

    this.apiService.addProduct(newWeapon).subscribe(
        (data: Object) => {
          this.toastr.success(`Product #${newid} added`);
          this.updateListeProduits();        
        },
        error => {
          console.error('Erreur lors de la récupération de l\'user :', error);
        }
      );
  }

  buy(price:number){
    if(this.user && price <= this.user.coins){
      this.user.coins = this.user.coins - price;
      this.apiService.updateUser(this.user);
    }
  }
  
  deleteProduct(id : number){
    this.apiService.deleteProduct(id).subscribe(
      (data: Object) => {
        this.toastr.warning(`Product #${id} deleted`);
        this.updateListeProduits();        
      },
      error => {
        console.error('Erreur lors de la récupération de l\'user :', error);
      }
    );
  }

  getNewWeaponName(){
    const adjListe = ["Grande", "Petite", "Lourde", "Légère", "Tranchante", "Massive", "Ancienne", "Dévastatrice", "Sombre", "Double", "Courte", "Longue"];
    const typeListe = ["Épée", "Rapière", "Hache", "Lance", "Arbalète", "Dague", "Massue", "Fronde"];
    const nomsLieux = ["Havrebrise", "Rochelune", "Port-Étoilé", "Sylvebourg", "Forgefer", "Clairétincelle", "Brumehaven", "Astrialto", "Sablevent", "Givrebourg"];

    const adjectif = adjListe[Math.floor(Math.random() * adjListe.length)];
    const typeArme = typeListe[Math.floor(Math.random() * typeListe.length)];
    const nomLieu = nomsLieux[Math.floor(Math.random() * nomsLieux.length)];

    return `${adjectif} ${typeArme} de ${nomLieu}`;
  }

  getWeaponCategorie(weaponName: string): number {
    const typeListe: string[] = ["Épée", "Rapière", "Hache", "Lance", "Arbalète", "Dague", "Massue", "Fronde"];
    for (let i = 0; i < typeListe.length; i++) {
        if (weaponName.includes(typeListe[i])) {
            return i+1;
        }
    }
    return -1;
}


  updateListeProduits(){
    this.apiService.getProducts().subscribe(
      (data: Product[]) => {
        this.listProduit = data;
      },
      error => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }
  
  getNewId():number{
    return Math.floor(Math.random() * 1000);
  }

  getHistory(){
    if(this.user){
      this.apiService.getHistory(this.user).subscribe(
        (data: Order[]) => {
          this.orders = data;
        },
        error => {
          console.error('Erreur lors de la récupération de l\'historique :', error);
        }
      );
    }
    
  }

  updateCategories(){
    this.apiService.getCategories().subscribe(
      (data: Categorie[]) => {
        this.categories = data;
      },
      error => {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    );
  }

  
  
}
