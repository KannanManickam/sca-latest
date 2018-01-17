import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class CustomerService {

  constructor(private db:AngularFireDatabase) { }

  getAll(){
    return this.db.list('/customers', ref => ref.orderByChild('customerName')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getCustomerProfile(customerId){
    return this.db.object('/customers/'+customerId).snapshotChanges()
      .map(changes => ({
          key: changes.payload.key, 
          ...changes.payload.val() 
      }));
  }

}
