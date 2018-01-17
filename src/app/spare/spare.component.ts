import { InventoryService } from '../inventory.service';
import { Component, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'spares',
  templateUrl: './spare.component.html',
  styleUrls: ['./spare.component.css']
})
export class SpareComponent {

  spareName$ = [];
  inventories:any[];

  @Input('group')
  public spareForm: FormGroup;

  constructor(private inventorySvc: InventoryService) { 
    this.inventorySvc.getAllInventories().subscribe(x=>{
      this.spareName$ = [];
      this.inventories = x;
      this.inventories.forEach(inv=>{
        if(inv.quantity>0)
          this.spareName$.push(inv.spareName);
      });
    });
  }

  onSparesSelect(spareName){
    let inv: any = {};
    this.inventorySvc.getBySpareName(spareName).take(1)
    .subscribe(records=>{
      inv = records;
      inv.forEach(y=>{
        this.spareForm.patchValue({
          spareAmount: y.spareAmount
        });
      });
    })
  }

}
