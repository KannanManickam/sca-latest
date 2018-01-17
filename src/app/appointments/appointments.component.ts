import { ActivatedRoute } from '@angular/router';
import { Appointments } from './../models/Appointments';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { AppointmentService } from '../appointment-service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnDestroy{

  appointments : Appointments[] = [];
  filteredAppointments : Appointments[] = [];
  tempAppointments : Appointments[] = [];
  localities$;
  subscription : Subscription;
  tableResource: DataTableResource<Appointments>;
  rows;
  itemCount : number;
  selLoc;
  @ViewChild('appsTable') table: any;
  isAdmin: boolean;

  constructor(
    private auth:AuthService,
    private route: ActivatedRoute, 
    private appointmentSvc: AppointmentService) { 

    auth.user$.subscribe(user=>{
      if(user){
        this.isAdmin = user.email.indexOf('admin') >= 0 ? true: false;
      }
    });

    this.selLoc = this.route.snapshot.paramMap.get('locality');

    this.subscription = this.appointmentSvc.getAll()
        .subscribe(records => {
          this.appointments = records;
          this.tempAppointments = records.filter(p => p.status != 'COMPLETE');
          this.initializeDataTable(records);
          
          //Filter data when redirected from Dashboard chart click          
          if(this.selLoc){
            this.onChartSelect(this.selLoc);
          }
        });
    
    this.localities$ = this.appointmentSvc.getAllLocalities();
  }

  private initializeDataTable(records: Appointments[]){
    this.tableResource = new DataTableResource(records);
    this.tableResource.query({})
      .then(items => this.rows = items);
    
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  reloadItems(params){
    if(!this.tableResource) return;

    this.tableResource.query(params)
    .then(items => this.rows = items);
  }

  filter(query: string){
    let filteredAppointments = (query) ?
      this.appointments.filter(p => p.phone.toString().toLowerCase().includes(query.toLowerCase())) :
      this.appointments;
    
    this.initializeDataTable(filteredAppointments);
  }

  onChartSelect(locality){
    this.filteredAppointments = (locality) ?
    this.tempAppointments.filter(p => p.locality === locality) :
    this.tempAppointments;

    this.initializeDataTable(this.filteredAppointments);
  }

  onLocalityChange(locality){
    this.filteredAppointments = (locality) ?
    this.appointments.filter(p => p.locality === locality) :
    this.appointments;
  
    this.initializeDataTable(this.filteredAppointments);
  }

  onStatusChange(status){
    this.filteredAppointments = (status) ?
    this.appointments.filter(p => p.status === status) :
    this.appointments;
  
    this.initializeDataTable(this.filteredAppointments);
  }

  getCellClass({ row, column, value }): any {
    return {
      'is-COMPLETE': value === 'COMPLETE',
      'is-ONGOING': value === 'ONGOING',
      'is-PENDING': value === 'PENDING'
    };
  }

  // toggleExpandRow(row) {
  //   console.log('Toggled Expand Row!', row);
  //   this.table.rowDetail.toggleExpandRow(row);
  // }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
}
