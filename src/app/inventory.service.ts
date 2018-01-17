import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class InventoryService {

  constructor(private db:AngularFireDatabase) { }
  
  getAllInventories(){
    return this.db.list('/inventories', ref => ref.orderByChild('brandName')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getInventory(id){
    return this.db.object('/inventories/'+id).snapshotChanges()
    .map(changes => ({
        key: changes.payload.key, 
        ...changes.payload.val() 
    }));
  }

  getBySpareName(spareName: string){
    return this.db.list('/inventories', 
      ref => ref.orderByChild('spareName').equalTo(spareName))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  createInventory(inventory){
    return this.db.list('/inventories').push(inventory);
  }

  updateInventory(id, inventory){
    return this.db.object('/inventories/'+id).update(inventory);
  }

  deleteInventory(id){
    return this.db.object('/inventories/'+id).remove();
  }

  updateInventoryCount(id, newCount){
    return this.db.object('/inventories/'+id).update({ quantity: newCount });
  }

  getAllBrands(){
    return this.db.list('/brands', ref => ref.orderByChild('brandName')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getBrand(id){
    return this.db.object('/brands/'+id).snapshotChanges()
    .map(changes => ({
        key: changes.payload.key, 
        ...changes.payload.val() 
    }));
  }

  createBrand(brand){
    return this.db.list('/brands').push(brand);
  }

  updateBrand(id, brand){
    return this.db.object('/brands/'+id).update(brand);
  }

  deleteBrand(id){
    return this.db.object('/brands/'+id).remove();
  }

  getAllProducts(){
    return this.db.list('/products', ref => ref.orderByChild('productName')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getProduct(id){
    return this.db.object('/products/'+id).snapshotChanges()
    .map(changes => ({
        key: changes.payload.key, 
        ...changes.payload.val() 
    }));
  }

  createProduct(product){
    return this.db.list('/products').push(product);
  }

  updateProduct(id, product){
    return this.db.object('/products/'+id).update(product);
  }

  deleteProduct(id){
    return this.db.object('/products/'+id).remove();
  }

  getAllStaffs(){
    return this.db.list('/staffs', ref => ref.orderByChild('name')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getStaff(id){
    return this.db.object('/staffs/'+id).snapshotChanges()
    .map(changes => ({
        key: changes.payload.key, 
        ...changes.payload.val() 
    }));
  }

  createStaff(product){
    return this.db.list('/staffs').push(product);
  }

  updateStaff(id, product){
    return this.db.object('/staffs/'+id).update(product);
  }

  deleteStaff(id){
    return this.db.object('/staffs/'+id).remove();
  }

}
