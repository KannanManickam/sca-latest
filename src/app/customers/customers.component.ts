import { BaseChartDirective } from 'ng2-charts';
import { AppointmentService } from '../appointment-service';
import { Customers } from './../models/Customers';
import { CustomerService } from '../customer.service';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnDestroy{

  subscription : Subscription;
  customers: Customers[]=[];
  tableResource: DataTableResource<Customers>;
  rows;
  itemCount : number;
  customerListMap : Map<string, number>;
  chartType = 'doughnut';
  chartColors: any[] = [
    { 
      backgroundColor:["#FFC133","#DAF7A6","#FFC300","#fd7e14","#17a2b8","#20c997",
                        "#FF5733","#C70039","#900C3F","#00FFFF","#008080","#008000","#808000"]
    }];
  @ViewChild( BaseChartDirective ) custChart: BaseChartDirective;

  constructor(private customerSvc: CustomerService) { 
    this.subscription = this.customerSvc.getAll()
        .subscribe(records => {
          this.customers = records;
          this.initializeDataTable(records);
          this.setChartDetails(records);
        });
  }

  private initializeDataTable(records: Customers[]){
    this.tableResource = new DataTableResource(records);
    this.tableResource.query({})
      .then(items => this.rows = items);
    
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  filter(query: string){
    let filteredProducts = (query) ?
      this.customers.filter(p => p.phone.includes(query)) :
      this.customers;
    
    this.initializeDataTable(filteredProducts);
  }

  private setChartDetails(records){
    this.customerListMap = new Map<string, number>();
    let labels = []; let data = [];

    records.forEach(element => {
      let count = this.customerListMap.get(element.locality)
      if(!count)
        this.customerListMap.set(element.locality, 1);
      else
        this.customerListMap.set(element.locality, count+1);
    });

    this.customerListMap.forEach((value: number, key: string) => {
      labels.push(key);
      data.push(value);
    });

    this.custChart.labels = labels;
    this.custChart.data = data;
    this.custChart.ngOnChanges({});
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
