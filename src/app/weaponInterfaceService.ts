import { Firestore, collection, deleteDoc, doc, docData, collectionData, query, updateDoc, addDoc } from "@angular/fire/firestore";


import { Weapon } from './weapon';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";



@Injectable({ providedIn: 'root' })
export class WeaponInterfaceService {
    private static url = 'weapons';
    
    constructor(private firestore: Firestore) {
    }

    getWeapons(): Observable<Weapon[]> {
        const weaponCollection = collection(this.firestore, WeaponInterfaceService.url);
        const q = query(weaponCollection)
        return collectionData(q, { idField: 'id' }) as Observable<Weapon[]>;
    }

    getWeapon(id: string): Observable<Weapon> {
        const weaponDocument = doc(this.firestore, WeaponInterfaceService.url + "/" + id);
        
        return docData(weaponDocument, { idField: 'id' }) as Observable<Weapon>;
    }

    deleteWeapon(id: string): Promise<void> {
    const weaponDocument = doc(this.firestore, WeaponInterfaceService.url + "/" + id);
    
    return deleteDoc(weaponDocument);
    }

    addWeapon(weapon: Weapon){
        const weaponCollection = collection(this.firestore, WeaponInterfaceService.url);
        
        addDoc(weaponCollection, weapon);
    }

    updateWeapon(weapon: Weapon): void {
        const heroDocument = doc(this.firestore, WeaponInterfaceService.url + "/" + weapon.id);
        let newWeaponJSON = {name: weapon.name, attaque: weapon.attaque, esquive: weapon.esquive, degats: weapon.degats, pv: weapon.pv};
        updateDoc(heroDocument, newWeaponJSON);
    }
}
