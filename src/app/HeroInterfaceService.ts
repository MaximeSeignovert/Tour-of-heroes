import { Firestore, collection, deleteDoc, doc, docData, collectionData, query, updateDoc, addDoc } from "@angular/fire/firestore";


import { Hero } from './hero';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({ providedIn: 'root' })
export class HerointerfaceService {
    private static url = 'heroes';
    
    constructor(private firestore: Firestore) {
    }

    getHeroes(): Observable<Hero[]> {
        const heroCollection = collection(this.firestore, HerointerfaceService.url);
        const q = query(heroCollection)
        return collectionData(q, { idField: 'id' }) as Observable<Hero[]>;
    }

    getHero(id: string): Observable<Hero> {
        const heroDocument = doc(this.firestore, HerointerfaceService.url + "/" + id);
        
        return docData(heroDocument, { idField: 'id' }) as Observable<Hero>;
    }

    deleteHero(id: string): Promise<void> {
        const heroDocument = doc(this.firestore, HerointerfaceService.url + "/" + id);
        
        return deleteDoc(heroDocument);
    }

    addHero(hero: Hero): void {
        const heroCollection = collection(this.firestore, HerointerfaceService.url);
        
        addDoc(heroCollection, hero);
    }

    updateHero(hero: Hero): void {
        const heroDocument = doc(this.firestore, HerointerfaceService.url + "/" + hero.id);
        let newHeroJSON = {id:hero.id, name: hero.name, weapon:hero.weapon, weaponStats:hero.weaponStats,attributes:hero.attributes,stats:hero.stats};
        updateDoc(heroDocument, newHeroJSON);
    }
}
