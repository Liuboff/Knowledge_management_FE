import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { AsideComponent } from './components/aside/aside.component';

@NgModule({
  declarations: [
    HeaderComponent,
    AsideComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    AsideComponent
  ]
})
export class SharedModule { }
