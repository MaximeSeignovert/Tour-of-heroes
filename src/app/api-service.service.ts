import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { Weapon } from './weapon';
import { WeaponInterfaceService } from './weaponInterfaceService';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { from } from 'rxjs';


export interface Product {
  id : number,
  name: string,
  stats: {
      pv:number,
      esquive:number,
      attaque:number,
      degats:number,
  },
  price: number,
  categoryId: number,
}

export interface User {
  id: number,
  username: String,
  email: String,
  password: String,
  coins: number
}

export interface Order {
  id: number,
  userId: number,
  products: Product[],
  total: number,
  orderDate: String
}

export interface Categorie {
  id: number,
  name: String
}


@Injectable({
  providedIn: 'root'
})
export class ApiServiceService{

  public activeUser = 1;
  public currentUser?: User; 

  baseUrl : string = `http://seignovm.fr`;

  serverStatus: boolean | undefined;

  user : User | undefined;
  listProduit : Product[] | undefined;
  


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient, 
    private weaponService: WeaponInterfaceService,
    private toastr: ToastrService,
  ) { }
  

  pingServer():Observable<Boolean> {
    const url = this.baseUrl;

    return this.httpClient.get(url).pipe(
      map(() => true),  // Si la requête a réussi, retourne true
      catchError(() => from([false]) )  // Si la requête a échoué, retourne false
    );
  }

  /**
   * Récupère les utilisateurs 
   */
  getUsers(): Observable<User[]>{
    const url = this.baseUrl + `/users`;
    
    return this.httpClient.get<User[]>(url).pipe(
      map(data => data)
    );
  }

  /**
   * Récupère l'utilisateur possédant le @param userId 
   */
  getUser(userId: number): Observable<User>{
    const url = this.baseUrl + `/users/${userId}`;
    
    return this.httpClient.get<User>(url).pipe(
      map(data => data)
    );
  }
  
  /**
   * Update l'user passé en paramètre
   */
  updateUser(userToUpdate : User){
    if(userToUpdate){
      const url = this.baseUrl + `/users/${userToUpdate.id}`;
  
      this.httpClient.post(url,userToUpdate).subscribe(
        () => {
          if(userToUpdate){
            this.getUser(userToUpdate.id);
          }
          
        },
        (error) => {
          console.error(`Erreur lors de l'update de l'user n°${userToUpdate.id}`, (error as Error).message);
        }
      );
    }
    
  }

  /**
   * Fonction qui renvoie la liste des produits
   */
  getProducts(page: number = 1): Observable<Product[]> {
    const url = this.baseUrl + '/products';
    const params = `?page=${page}`;

    return this.httpClient.get<Product[]>(url + params).pipe(
      map(data => data)
    );
  }

  /**
   * Renvoie le product passé en paramètre
   * @param productId id of the wanted product
   * @returns Product with right id
   */
  getProduct(productId: number): Observable<Product> {
    const url = this.baseUrl + `/products/${productId}`;

    return this.httpClient.get<Product>(url).pipe(
      map(data => data)
    );
  }

  /**
   * 
   * @param id Supprime le produit avec l'id
   * @returns Object de suppression
   */
  deleteProduct(id:number): Observable<Object>{
    const url = this.baseUrl + `/products/${id}`;
  
    return this.httpClient.delete<Object>(url).pipe(
      map(data => data)
    );
  }

  /**
   * Ajoute le produit passé en paramètre
   * @param p 
   * @returns 
   */
  addProduct(p : Product): Observable<Object>{
    const url = this.baseUrl + `/products`;
    
    return this.httpClient.post<Object>(url,p).pipe(
      map(data => data)
    );
  }
  
  /**
   * Récupère l'historique d'achat d'un utilisateurs
   * @param u Utilisateur sélectionné
   * @returns Liste d'order
   */
  getHistory(u : User): Observable<Order[]>{
    const url = this.baseUrl + `/users/${u.id}/orders`;
    
    return this.httpClient.get<Order[]>(url).pipe(
      map(data => data)
    );
  }


  getCategories(): Observable<Categorie[]>{
    const url = this.baseUrl + `/categories`;
    
    return this.httpClient.get<Categorie[]>(url).pipe(
      map(data => data)
    );
  }

  getCurrentUser(){
    return this.user;
  }
}


