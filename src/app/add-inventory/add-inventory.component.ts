import { InventoryService } from './../inventory.service';
import { Router } from '@angular/router';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent {

  brand$;
  action;
  
  constructor(
    private inventorySvc: InventoryService,
    public dialogRef: MatDialogRef<AddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.action = this.dialogRef.id;
    this.brand$ = this.inventorySvc.getAllBrands();
    console.log(this.brand$);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
