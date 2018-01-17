import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customers } from './../models/Customers';
import { CustomerService } from '../customer.service';
import { Subscription } from 'rxjs/Subscription';
import { AppointmentService } from '../appointment-service';
import { Appointments } from './../models/Appointments';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent implements OnDestroy {

  subscription : Subscription;
  appSubscription: Subscription;
  // customers = '';
  customers:any = {};
  customerId;
  custAppointments : Appointments[];
  tableResource: DataTableResource<Appointments>;
  rows;
  itemCount : number;

  constructor(
    private customerSvc: CustomerService, 
    private route:ActivatedRoute,
    private appointmetSvc: AppointmentService) { 

    this.customerId = this.route.snapshot.paramMap.get('id');

    if(this.customerId){
      this.subscription = this.customerSvc.getCustomerProfile(this.customerId)
        .subscribe(custDetails=>{
          this.customers = custDetails;
          
          this.appSubscription = this.appointmetSvc.getCustomerWise(this.customers.phone)
          .subscribe(records => {
            this.custAppointments = records;
            this.initializeDataTable(records);
          });
        });      
    }

  }

  private initializeDataTable(records: Appointments[]){
    this.tableResource = new DataTableResource(records);
    this.tableResource.query({})
      .then(items => this.rows = items);
    
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  getCellClass({ row, column, value }): any {
    return {
      'is-COMPLETE': value === 'COMPLETE',
      'is-ONGOING': value === 'ONGOING',
      'is-PENDING': value === 'PENDING'
    };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.appSubscription.unsubscribe();
  }
}
