import { BaseChartDirective } from 'ng2-charts';
import { AddInventoryComponent } from '../add-inventory/add-inventory.component';
import { Router } from '@angular/router';
import { InventoryService } from './../inventory.service';
import { Inventories } from './../models/Inventories';
import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { DataTableResource } from 'angular-4-data-table-bootstrap-4';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppointmentNewComponent } from '../appointment-new/appointment-new.component';
import 'rxjs/add/operator/take';
import { Brands } from '../models/Brands';
import { Products } from '../models/Products';
import { Staffs } from '../models/Staffs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnDestroy {

  constructor(
    private inventorySvc: InventoryService, 
    private dialog: MatDialog,
    private router: Router) {

    this.subscription = this.inventorySvc.getAllInventories()
        .subscribe(records => {
          this.inventories = records;
          this.initializeDataTable(records);
          // this.setChartDetails(records);
        });

    this.brandSubscription = this.inventorySvc.getAllBrands()
      .subscribe(records => {
        this.brands = records;
        this.initializeBrandDataTable(records);
      });
    
    this.productSubscription = this.inventorySvc.getAllProducts()
      .subscribe(records => {
        this.products = records;
        this.initializeProductDataTable(records);
      });

    this.staffSubscription = this.inventorySvc.getAllStaffs()
      .subscribe(records => {
        this.staffs = records;
        this.initializeStaffDataTable(records);
      });
  }

  /*  Inventory Management Begins */
  subscription : Subscription;
  inventories: Inventories[]=[];
  tableResource: DataTableResource<Inventories>;
  rows;
  itemCount : number;
  invChartType = 'doughnut';
  chartColors: any[] = [
    { 
      backgroundColor:["#FFC133","#DAF7A6","#FFC300","#fd7e14","#17a2b8","#20c997",
                        "#FF5733","#C70039","#900C3F","#00FFFF","#008080","#008000","#808000"]
    }];
  @ViewChild( BaseChartDirective ) invChart: BaseChartDirective;

  editing = {};
  newInventory: any = {};

  private initializeDataTable(records: Inventories[]){
    this.tableResource = new DataTableResource(records);
    this.tableResource.query({})
      .then(items => this.rows = items);
    
    this.tableResource.count()
      .then(count => this.itemCount = count);
  }

  filter(query: string){
    let filteredProducts = (query) ?
      this.inventories.filter(p => p.spareName.toLowerCase().includes(query.toLowerCase())) :
      this.inventories;
    
    this.initializeDataTable(filteredProducts);
  }

  // private setChartDetails(inventories){
  //   var chartLabels = []; var chartData = [];

  //   inventories.forEach(element => {
  //     chartLabels.push(element.spareName);
  //     chartData.push(element.quantity);
  //   });

  //   this.invChart.labels = chartLabels;
  //   this.invChart.data = chartData;
  //   this.invChart.ngOnChanges({});
  // }

  addInventory(){
    let dialogRef = this.dialog.open(AddInventoryComponent,{
      width: '400px',
      id: 'Inventory',
      data: { brandName: '', 
              spareCode: '', 
              spareName: '', 
              spareAmount: '', 
              quantity: '' }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.newInventory = result;
      if(this.newInventory){
        let result = this.inventorySvc.createInventory(this.newInventory);
        alert('Inventory Added successfully');
      }
    });
  }

  deleteInventory(id){
    const dialogRef = this.dialog.open(AppointmentNewComponent);
    
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        let result = this.inventorySvc.deleteInventory(id);
        alert('Inventory Deleted successfully');
      }
    });    
  }

  editInventory(id){
    let dialogRef;
    if(id){
      this.inventorySvc.getInventory(id).take(1).subscribe(invDetails=>{
        dialogRef = this.dialog.open(AddInventoryComponent,{
          width: '400px',
          id: 'Inventory',
          data: {
            brandName: invDetails.brandName, 
            spareCode: invDetails.spareCode, 
            spareName: invDetails.spareName, 
            spareAmount: invDetails.spareAmount, 
            quantity: invDetails.quantity
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          let updatedInv = result;
          if(updatedInv){
            let result = this.inventorySvc.updateInventory(id, updatedInv);
            alert('Inventory Updated successfully');
          }
        });
      });
    }    
  }
  /*  Inventory Management Ends */

  /*  Brand Management Begins */
  brandSubscription : Subscription;
  brands: Brands[]=[];
  brandTableResource: DataTableResource<Brands>;
  brandRows;
  brandItemCount : number;
  newBrand: any = {};

  private initializeBrandDataTable(records: Brands[]){

    this.brandTableResource = new DataTableResource(records);
    this.brandTableResource.query({})
      .then(items => this.brandRows = items);
    
    this.brandTableResource.count()
      .then(count => this.brandItemCount = count);
  }

  brandFilter(query: string){
    let filteredBrands = (query) ?
      this.brands.filter(p => p.brandName.toLowerCase().includes(query.toLowerCase())) :
      this.brands;
    
    this.initializeBrandDataTable(filteredBrands);
  }

  addBrand(){
    let dialogRef = this.dialog.open(AddInventoryComponent,{
      width: '400px',
      id: 'Brand',
      data: { brandName: '', 
              brandCode: ''}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.newBrand = result;
      if(this.newBrand){
        let result = this.inventorySvc.createBrand(this.newBrand);
        alert('Brand Added successfully');
      }
    });
  }

  deleteBrand(id){
    const dialogRef = this.dialog.open(AppointmentNewComponent);
    
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        let result = this.inventorySvc.deleteBrand(id);
        alert('Brand Deleted successfully');
      }
    });    
  }

  editBrand(id){
    let dialogRef;
    if(id){
      this.inventorySvc.getBrand(id).take(1).subscribe(brandDetails=>{
        dialogRef = this.dialog.open(AddInventoryComponent,{
          width: '400px',
          id: 'Brand',
          data: {
            brandName: brandDetails.brandName, 
            brandCode: brandDetails.brandCode
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          let updatedBrand = result;
          if(updatedBrand){
            let result = this.inventorySvc.updateBrand(id, updatedBrand);
            alert('Brand Updated successfully');
          }
        });
      });
    }    
  }

  /*  Brand Management Ends */

  /*  Product Management Begins */
  productSubscription : Subscription;
  products: Products[]=[];
  productTableResource: DataTableResource<Products>;
  productRows;
  productItemCount : number;
  newProduct: any = {};

  private initializeProductDataTable(records: Products[]){
    this.productTableResource = new DataTableResource(records);
    this.productTableResource.query({})
      .then(items => this.productRows = items);
    
    this.productTableResource.count()
      .then(count => this.productItemCount = count);
  }

  productFilter(query: string){
    let filteredProducts = (query) ?
      this.products.filter(p => p.productName.toLowerCase().includes(query.toLowerCase())) :
      this.products;
    
    this.initializeProductDataTable(filteredProducts);
  }

  addProduct(){
    let dialogRef = this.dialog.open(AddInventoryComponent,{
      width: '400px',
      id: 'Product',
      data: { productName: '', 
              productCode: ''}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.newProduct = result;
      if(this.newProduct){
        let result = this.inventorySvc.createProduct(this.newProduct);
        alert('Product Added successfully');
      }
    });
  }

  deleteProduct(id){
    const dialogRef = this.dialog.open(AppointmentNewComponent);
    
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        let result = this.inventorySvc.deleteProduct(id);
        alert('Product Deleted successfully');
      }
    });    
  }

  editProduct(id){
    let dialogRef;
    if(id){
      this.inventorySvc.getProduct(id).take(1).subscribe(productDetails=>{
        dialogRef = this.dialog.open(AddInventoryComponent,{
          width: '400px',
          id: 'Product',
          data: {
            productName: productDetails.productName, 
            productCode: productDetails.productCode
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          let updatedProduct = result;
          if(updatedProduct){
            let result = this.inventorySvc.updateProduct(id, updatedProduct);
            alert('Product Updated successfully');
          }
        });
      });
    }    
  }

  /*  Product Management Ends */

  /*  Staff Management Begins */
  staffSubscription : Subscription;
  staffs: Staffs[]=[];
  staffTableResource: DataTableResource<Staffs>;
  staffRows;
  staffItemCount : number;
  newStaff: any = {};

  private initializeStaffDataTable(records: Staffs[]){
    this.staffTableResource = new DataTableResource(records);
    this.staffTableResource.query({})
      .then(items => this.staffRows = items);
    
    this.staffTableResource.count()
      .then(count => this.staffItemCount = count);
  }

  staffFilter(query: string){
    let filteredStaffs = (query) ?
      this.staffs.filter(p => p.name.toLowerCase().includes(query.toLowerCase())) :
      this.staffs;
    
    this.initializeStaffDataTable(filteredStaffs);
  }

  addStaff(){
    let dialogRef = this.dialog.open(AddInventoryComponent,{
      width: '400px',
      id: 'Staff',
      data: { name: '', 
              phone: ''}
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.newStaff = result;
      if(this.newStaff){
        let result = this.inventorySvc.createStaff(this.newStaff);
        alert('Staff Added successfully');
      }
    });
  }

  deleteStaff(id){
    const dialogRef = this.dialog.open(AppointmentNewComponent);
    
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        let result = this.inventorySvc.deleteStaff(id);
        alert('Staff Deleted successfully');
      }
    });    
  }

  editStaff(id){
    let dialogRef;
    if(id){
      this.inventorySvc.getStaff(id).take(1).subscribe(staffDetails=>{
        dialogRef = this.dialog.open(AddInventoryComponent,{
          width: '400px',
          id: 'Staff',
          data: {
            name: staffDetails.name, 
            phone: staffDetails.phone
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          let updatedStaff = result;
          if(updatedStaff){
            let result = this.inventorySvc.updateStaff(id, updatedStaff);
            alert('Staff Updated successfully');
          }
        });
      });
    }    
  }

  /*  Staff Management Ends */

  ngOnDestroy(){
    this.subscription.unsubscribe();
    this.brandSubscription.unsubscribe();
    this.productSubscription.unsubscribe();
    this.staffSubscription.unsubscribe();
  }

}
