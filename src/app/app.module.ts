import { InventoryService } from './inventory.service';
import { CustomerService } from './customer.service';
import { AuthService } from './auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Angular Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatButtonModule, MatButtonToggleModule, MatExpansionModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthGuard } from './auth-guard.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AppointmentsComponent } from './appointments/appointments.component';
import { CustomersComponent } from './customers/customers.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AppointmentNewComponent } from './appointment-new/appointment-new.component';
import { AppointmentStatusComponent } from './appointment-status/appointment-status.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SpareComponent } from './spare/spare.component';
import { AppointmentService } from './appointment-service';
import { CustomerProfileComponent } from './customer-profile/customer-profile.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    AppointmentsComponent,
    CustomersComponent,
    InventoryComponent,
    AppointmentNewComponent,
    AppointmentStatusComponent,
    SpareComponent,
    CustomerProfileComponent,
    AddInventoryComponent,
    ReportsComponent,
  ],
  imports: [
    AngularFireAuthModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatExpansionModule,
    NgxDatatableModule,
    AngularFireDatabaseModule,
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    RouterModule.forRoot([
      {path:'', component: DashboardComponent, canActivate: [AuthGuard]},
      
      {path:'login', component: LoginComponent},

      {path:'appointments', component: AppointmentsComponent, canActivate: [AuthGuard]},
      {path:'appointments/new', component: AppointmentStatusComponent, canActivate: [AuthGuard]},
      {path:'appointments/:locality', component: AppointmentsComponent, canActivate: [AuthGuard]},
      {path:'appointments/status/:id', component: AppointmentStatusComponent, canActivate: [AuthGuard]},
      {path:'appointments/status/:id/:action', component: AppointmentStatusComponent, canActivate: [AuthGuard]},
      
      {path:'customers', component: CustomersComponent, canActivate: [AuthGuard]},
      {path:'customers/profile/:id', component: CustomerProfileComponent, canActivate: [AuthGuard]},
      
      {path:'inventory', component: InventoryComponent, canActivate: [AuthGuard]},
      {path:'reports', component: ReportsComponent, canActivate: [AuthGuard]}
    ])
  ],
  providers: [
    AppointmentService,
    CustomerService,
    InventoryService,
    AuthService,
    AuthGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'en-IN'}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppointmentNewComponent,
    AddInventoryComponent
  ],
})
export class AppModule { }
