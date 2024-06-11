import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { WeaponsComponent } from './weapons/weapons.component';
import { WeaponDetailComponent } from './weapon-detail/weapon-detail.component';
import { ArenaComponent } from './arena/arena.component';
import { ShopComponent } from './shop/shop.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroesComponent },
  { path: 'weapons', component: WeaponsComponent },
  { path: 'weapons/details/:id', component: WeaponDetailComponent },
  { path: 'arena', component: ArenaComponent},
  { path: 'shop', component: ShopComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes),HttpClientModule ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}