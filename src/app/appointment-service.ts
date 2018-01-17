import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AppointmentService {

  constructor(private db:AngularFireDatabase) { }

  getAll(){
    return this.db.list('/appointments', ref => ref.orderByChild('customerName')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getCompletedList(){
    return this.db.list('/appointments', ref => ref.orderByChild('status').equalTo('COMPLETE'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  get(appointmentId){
    return this.db.object('/appointments/'+appointmentId).snapshotChanges()
    .map(changes => ({
        key: changes.payload.key, 
        ...changes.payload.val() 
    }));
  }

  getAreaWise(){
    return this.db.list('/appointments', ref => ref.orderByChild('area').equalTo('Salem')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getCustomerWise(phone: string){
    return this.db.list('/appointments', 
      ref => ref.orderByChild('phone').equalTo(phone))
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          $key: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getAllLocalities(){
    return this.db.list('/localities').snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          locality: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getAllStaffs(){
    return this.db.list('/staffs', ref => ref.orderByChild('name')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          locality: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  getAllProductTypes(){
    return this.db.list('/productTypes', ref => ref.orderByChild('name')).snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          locality: c.payload.key, 
          ...c.payload.val() 
        }));
      });
  }

  storeLocalities(){
    var locality = []; var count = [];
    this.getAreaWise()
      .subscribe(appointments => {
        console.log(appointments);
      });
  }

  createAppointment(appointment){
    return this.db.list('/appointments').push(appointment);
  }

  updateAppointment(appointmentId, appointment){
    return this.db.object('/appointments/'+appointmentId).update(appointment);
  }

  deleteAppointment(appointmentId){
    return this.db.object('/appointments/'+appointmentId).remove();
  }
}
