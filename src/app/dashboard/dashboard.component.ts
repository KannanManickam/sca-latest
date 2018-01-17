import { Router } from '@angular/router';
import { element } from 'protractor';
import { Localities } from '../models/Localities';
import { Appointments } from './../models/Appointments';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { AppointmentService } from '../appointment-service';
import { BaseChartDirective } from 'ng2-charts';

import Chart from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

  appointments : Appointments[];
  subscription : Subscription;
  completeSubscription : Subscription;
  tableResource: DataTableResource<Appointments>;
  upcomingRows;
  completedRows;
  itemCount : number;
  appListMap : Map<string, number>;
  chartType = 'doughnut';
  chartColors: any[] = [
    { 
      backgroundColor:["#FFC133","#DAF7A6","#fd7e14","#17a2b8","#20c997","#FF5733",
                        "#C70039","#900C3F","#00FFFF","#008080","#008000","#808000"]
    }];
  @ViewChild( BaseChartDirective ) myChart: BaseChartDirective;

  constructor(private appointmetSvc: AppointmentService, private router: Router) { 
    this.subscription = this.appointmetSvc.getAll()
      .subscribe(records => {
        this.appointments = records;
        this.initializeUpcomingDataTable();

        records.filter(p => p.status != 'COMPLETE');
        this.setChartDetails(records.filter(p => p.status != 'COMPLETE'));
      });

    this.completeSubscription = this.appointmetSvc.getCompletedList()
      .subscribe(records => {
        this.initializeCompletedDataTable(records);
      });
  }

  private initializeUpcomingDataTable(){
    let filteredProducts = this.appointments.filter(p => p.status.toUpperCase().includes('ONGOING'));

    this.tableResource = new DataTableResource(filteredProducts);
    this.tableResource.query({})
      .then(items => this.upcomingRows = items);
  }

  private initializeCompletedDataTable(records: Appointments[]){
    var oneDay=1000*60*60*24;

    records.forEach(x=>{
      var t = new Date(x.cashRcvDateStr).getTime() - new Date().getTime();
      x.dueDays = -Math.round(t/oneDay);
    });

    let filteredProducts = records.filter(p => p.dueDays > 90);

    this.tableResource = new DataTableResource(filteredProducts);
    this.tableResource.query({})
      .then(items => this.completedRows = items);
  }

  getCellClass({ row, column, value }): any {
    return {
      'is-COMPLETE': value === 'COMPLETE',
      'is-ONGOING': value === 'ONGOING',
      'is-PENDING': value === 'PENDING'
    };
  }

  getDueCellClass({ row, column, value }): any {
    return {
      'is-LOW': value < 150 && value > 90,
      'is-NORMAL': value < 300 && value >= 150,
      'is-HIGH': value >= 300,
    };
  }

  private setChartDetails(records){
    this.appListMap = new Map<string, number>();
    var chartLabels = []; var chartData = [];

    records.forEach(element => {
      let count = this.appListMap.get(element.locality)
      if(!count)
        this.appListMap.set(element.locality, 1);
      else
        this.appListMap.set(element.locality, count+1);
    });

    this.appListMap.forEach((value: number, key: string) => {
      // if(value>=3){
        chartLabels.push(key);
        chartData.push(value);
      // }
    });

    var chartOptions = {
      showLabel: true
    };

    this.myChart.labels = chartLabels;
    this.myChart.data = chartData;
    this.myChart.options = chartOptions;
    this.myChart.ngOnChanges({});
  }

  @ViewChild('donut') donut: ElementRef;

  ngOnInit() {
    // let donutCtx = this.donut.nativeElement.getContext('2d');

    // var data = {
    //     labels: [
    //         "Value A",
    //         "Value B"
    //     ],
    //     datasets: [
    //         {
    //             "data": [101342, 55342],   // Example data
    //             "backgroundColor": [
    //                 "#1fc8f8",
    //                 "#76a346"
    //             ]
    //         }]
    // };

    // var chart = new Chart(
    //     donutCtx,
    //     {
    //         "type": 'doughnut',
    //         "data": data,
    //         "options": {
    //             "cutoutPercentage": 50,
    //             "animation": {
    //                 "animateScale": true,
    //                 "animateRotate": false
    //             },
    //             "label": {
    //               "display": false
    //             }
    //         }
    //     }
    // );
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.completeSubscription.unsubscribe();
  }
 
  public chartClicked(e:any):void {
    if(e.active.length > 0) {
      // console.log("Index", e.active[0]._index);
      // console.log("Data" , e.active[0]._chart.config.data.datasets[0].data[e.active[0]._index]);
      var locality = e.active[0]._chart.config.data.labels[e.active[0]._index]
      this.router.navigate(['/appointments',locality]);
    }
  }
}
