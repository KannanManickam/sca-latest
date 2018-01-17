import { InventoryService } from './../inventory.service';
import { Component, OnDestroy } from '@angular/core';
import { AppointmentService } from '../appointment-service';
import { Subscription } from 'rxjs/Subscription';
import { Appointments } from '../models/Appointments';
import { Inventories } from '../models/Inventories';
import { Brands } from '../models/Brands';
import { Products } from '../models/Products';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnDestroy {

  panelOpenState: boolean = false;
  localities$;
  status$;
  invType$;
  subscription : Subscription;
  appointments : Appointments[] = [];
  inventories: Inventories[]=[];
  brands: Brands[]=[];
  products: Products[]=[];
  selLocality;
  selStatus;
  selInvType;
  fromDate;
  toDate;

  constructor(private appointmentSvc: AppointmentService, private inventorySvc: InventoryService) { 
    this.localities$ = this.appointmentSvc.getAllLocalities();
    this.status$ = ["ALL","ONGOING","PENDING","COMPLETE"];
    this.invType$ = ["Brand","Spare","Product"];

    this.subscription = this.appointmentSvc.getAll()
      .subscribe(records => {
        this.appointments = records;
      });

    this.subscription = this.inventorySvc.getAllBrands()
      .subscribe(records => {
        this.brands = records;
      });

    this.subscription = this.inventorySvc.getAllInventories()
      .subscribe(records => {
        this.inventories = records;
      });

    this.subscription = this.inventorySvc.getAllProducts()
      .subscribe(records => {
        this.products = records;
      });
  }

  downloadAppointments(){
    console.log('From:',this.fromDate, 'To:', this.toDate);
    let filterAppointments = this.appointments;
    
    if(this.selLocality)
      filterAppointments = filterAppointments.filter(p => 
        p.locality.toString().toLowerCase().includes(this.selLocality.toLowerCase()));
    
    if(this.selStatus && this.selStatus!='ALL')
      filterAppointments = filterAppointments.filter(p => 
        p.status.toString().toLowerCase().includes(this.selStatus.toLowerCase()));

    if(filterAppointments.length === 0){
      alert("No Data to Download, Refine the Criteria");
      return;
    }

    this.exportToCsv(filterAppointments, 'Appointments');
  }

  downloadInventoryRpt(){
    console.log(this.selInvType);
    if(this.selInvType){
      switch(this.selInvType){
        case "Brand":
          console.log(this.brands);
          this.exportToCsv(this.brands, 'Brands');
          return;
        case "Spare":          
          console.log(this.inventories);
          this.exportToCsv(this.inventories, 'Spares');
          return;
        case "Product":
          console.log(this.products);
          this.exportToCsv(this.products, 'Products');
          return;
      }
    }else{
      alert('Select Inventory Type');
    }
  }

  exportToCsv(data, type){
    var csvData = this.ConvertToCSV(data);
    var a = document.createElement("a");
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    var blob = new Blob([csvData], { type: 'text/csv' });
    var url= window.URL.createObjectURL(blob);
    a.href = url;
    a.download = type + '.csv';
    a.click();
  }

  ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var row = "";

    for (var index in objArray[0]) {
        //Now convert each value to string and comma-separated
        if(index.trim()!='$key' &&
            index.trim()!='appointmentDate' && 
            index.trim()!='callDate' && 
            index.trim()!='cashRcvDate')
          row += this.generateHeader(index.trim()) + ',';
    }
    row = row.slice(0, -1);    
    //append Label row with line break
    str += row + '\r\n';
    
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
          if(index.trim()!='$key' &&
              index.trim()!='appointmentDate' && 
              index.trim()!='callDate' && 
              index.trim()!='cashRcvDate'){
          
            if (line != '') line += ','

            var value = array[i][index];
            
            if(index.trim() === 'spares'){
              line += this.buildSparesDetails(value);
            } else{
              line += value;
            }
          }
        }
        str += line + '\r\n';
    }
    return str;
  }

  generateHeader(value): any {
    switch(value){
      case "address":
        return "Address";
      case "altPhone":
        return "Alternate Phone";
      case "appointmentDateStr":
        return "Appointment Date";
      case "appointmentTime":
        return "Appointment Time";
      case "brand":
        return "Brand";
      case "callDateStr":
        return "Call Date";
      case "cashRcvDateStr":
        return "Cash Received/Closed Date";
      case "customerName":
        return "Customer Name";
      case "locality":
        return "Locality";
      case "phone":
        return "Phone";
      case "productType":
        return "Product Type";
      case "rcNo":
        return "Receipt No";
      case "spares":
        return "Spares";
      case "sparesTotal":
        return "Spares Total";
      case "staff":
        return "Staff";
      case "status":
        return "Status";
      case "svcCharge":
        return "Service Charge";
      case "totalAmount":
        return "Total Amount";
      case "visitType":
        return "Visit Type";
      case "brandCode":
        return "Brand Code";
      case "brandName":
        return "Brand Name";
      case "productCode":
        return "Product Code";
      case "productName":
        return "Product Name";
      case "spareCode":
        return "Spare Code";
      case "spareName":
        return "Spare Name";
      case "spareAmount":
        return "Spare Amount";
      case "quantity":
        return "Quantity";
      default:
        return value;
    }
  }

  buildSparesDetails(spares){
    var spareLine = '';
    if(spares){
      spares.forEach(x => {
        if (spareLine != '') spareLine += ';'

        spareLine += x.spareName + ":" + x.spareAmount;
      });
    }
    return spareLine;
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
  
}
