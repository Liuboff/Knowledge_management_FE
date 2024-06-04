import { NgModule } from '@angular/core';
import { PeopleComponent } from './people.component';
import { CommonModule } from '@angular/common';
import { PeopleRoutingModule } from './people-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    PeopleComponent,
],
  imports: [
    CommonModule,
  ],
  exports: [
    PeopleComponent,
    PeopleRoutingModule,
    FormsModule,
    HttpClientModule
  ]
})
export class PeopleModule { }
