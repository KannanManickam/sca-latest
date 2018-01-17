import { CustomerService } from './../customer.service';
import { InventoryService } from './../inventory.service';
import { AppointmentNewComponent } from './../appointment-new/appointment-new.component';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { AppointmentService } from '../appointment-service';

@Component({
  selector: 'app-appointment-status',
  templateUrl: './appointment-status.component.html',
  styleUrls: ['./appointment-status.component.css']
})
export class AppointmentStatusComponent {

  appStatusForm: FormGroup;
  id;
  action;
  isEditApp: boolean = false;

  localities$;
  visitType$;
  staff$;
  productType$;
  brand$;
  status$;
  appointmentTime$;

  // minDate = new Date(2017, 0, 1);
  // maxDate = new Date();

  constructor(
    private fb: FormBuilder, 
    private route:ActivatedRoute, 
    private router: Router, 
    private appointmentSvc: AppointmentService,
    private inventorySvc: InventoryService,
    private customerSvc: CustomerService,
    private dialog: MatDialog) {
    
    this.id = this.route.snapshot.paramMap.get('id');
    this.action = this.route.snapshot.paramMap.get('action');
    this.initializeForm();

    console.log('id', this.id, 'action', this.action);
    
    this.appStatusForm = fb.group({
      customerName: ['', Validators.required],
      callDate: ['', Validators.required],
      address: ['', Validators.required],
      locality: ['', Validators.required],
      phone: ['', Validators.required],
      altPhone: [''],

      visitType: ['', Validators.required],
      staff: ['', Validators.required],
      productType: ['', Validators.required],
      brand: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      status: ['', Validators.required],

      svcCharge: [''],
      spares: fb.array([]),
      sparesTotal: [''],
      totalAmount: [''],
      
      rcNo: [''],
      cashRcvDate: [''],

      //Temporary to store date in string format
      callDateStr: [''],
      appointmentDateStr: [''],
      cashRcvDateStr: [''],
    });

    if(!this.id){
      this.addSpares();
      // this.sampleLoadValues();
    }

    this.appStatusForm.controls.svcCharge.valueChanges.subscribe(x => {
      this.calculateTotal();
    });

    this.appStatusForm.controls.spares.valueChanges.subscribe(x => {
      this.calculateTotal();
    });
  }

  
  private initializeForm(){
    this.localities$ = this.appointmentSvc.getAllLocalities();
    this.visitType$ = ["INSTALLATION", "SERVICE"];
    this.staff$ = this.appointmentSvc.getAllStaffs();
    this.productType$ = this.inventorySvc.getAllProducts();
    this.brand$ = this.inventorySvc.getAllBrands();
    this.status$ = ["ONGOING","PENDING"];

    this.appointmentTime$ = ["12:00AM","12:30AM","1:00AM","1:30AM","2:00AM","2:30AM","3:00AM","3:30AM",
                              "4:00AM","4:30AM","5:00AM","5:30AM","6:00AM","6:30AM","7:00AM","7:30AM",
                              "8:00AM","8:30AM","9:00AM","9:30AM","10:00AM","10:30AM","11:00AM","11:30AM",
                              "12:00PM","12:30PM","1:00PM","1:30PM","2:00PM","2:30PM","3:00PM","3:30PM",
                              "4:00PM","4:30PM","5:00PM","5:30PM","6:00PM","6:30PM","7:00PM","7:30PM",
                              "8:00PM","8:30PM","9:00PM","9:30PM","10:00PM","10:30PM","11:00PM","11:30PM"];
    
    if(this.id){
      if(!this.action)
        this.isEditApp = true;
      
      if(this.action == 'customer'){
        this.customerSvc.getCustomerProfile(this.id).take(1).subscribe(custDetails=>{
          this.buildCustForm(custDetails);
        })
      }else{
        this.appointmentSvc.get(this.id).subscribe(appDetails=>{
          this.buildForm(appDetails);
        });
      }
    }
  }
      
  private buildCustForm(custDetails){
    this.addSpares();

    this.appStatusForm.patchValue({
      customerName: custDetails.customerName,
      address: custDetails.address,
      locality: custDetails.locality,
      phone: custDetails.phone
    });
  }
  
  private buildForm(appDetails){
    if(appDetails.spares && !this.action){
      appDetails.spares.forEach((spare, index) => {
        this.addSpares(spare);
      })
    }else{
      this.addSpares();
    }

    if(this.action){
      this.appStatusForm.patchValue({
        customerName: appDetails.customerName,
        address: appDetails.address,
        locality: appDetails.locality,
        phone: appDetails.phone,
        altPhone: appDetails.altPhone,
  
        visitType: appDetails.visitType,
        productType: appDetails.productType,
        brand: appDetails.brand
      });
    } else{
      this.appStatusForm.patchValue({
        customerName: appDetails.customerName,
        callDate: new Date(appDetails.callDateStr),
        address: appDetails.address,
        locality: appDetails.locality,
        phone: appDetails.phone,
        altPhone: appDetails.altPhone,
  
        visitType: appDetails.visitType,
        staff: appDetails.staff,
        productType: appDetails.productType,
        brand: appDetails.brand,
        appointmentDate: new Date(appDetails.appointmentDateStr),
        appointmentTime: appDetails.appointmentTime,
        status: appDetails.status,
  
        svcCharge: appDetails.svcCharge,
        sparesTotal: appDetails.sparesTotal,
        totalAmount: appDetails.totalAmount, 
  
        rcNo: appDetails.rcNo,
        cashRcvDate: appDetails.cashRcvDateStr ? new Date(appDetails.cashRcvDateStr): ''
      });
    }

    // this.appStatusForm.controls['customerName'].disable();
    // this.appStatusForm.controls['callDate'].disable();
    // this.appStatusForm.controls['address'].disable();
    // this.appStatusForm.controls['locality'].disable();
    // this.appStatusForm.controls['phone'].disable();
    // this.appStatusForm.controls['visitType'].disable();
    // this.appStatusForm.controls['productType'].disable();
    // this.appStatusForm.controls['brand'].disable();
    // this.appStatusForm.controls['spares'].disable();
  }

  addSpares(spare?: any){
    const control = <FormArray>this.appStatusForm.controls['spares'];
    let spareCtrl = this.fb.group({
                      spareName: [spare? spare.spareName:''],
                      spareAmount: [spare? spare.spareAmount:'']
                    });   
    control.push(spareCtrl);
  }

  removeSpares(i: number) {
    const control = <FormArray>this.appStatusForm.controls['spares'];
    control.removeAt(i);
  }

  private calculateTotal(){
    let sparesTotal = 0;
    const ctrl = <FormArray>this.appStatusForm.controls['spares'];
    ctrl.controls.forEach(x => {
      let parsed = parseInt(x.get('spareAmount').value? x.get('spareAmount').value : 0);
      sparesTotal += parsed;
    });

    let totalAmount = sparesTotal + parseInt(this.appStatusForm.controls.svcCharge.value ? 
                                              this.appStatusForm.controls.svcCharge.value : 0);
    this.appStatusForm.patchValue({
      sparesTotal: sparesTotal > 0 ? sparesTotal: '',
      totalAmount: totalAmount > 0 ? totalAmount: '',
    });
  }

  updateAppointment(){
    this.customFormateDate();
    console.log(this.appStatusForm.value);
    let result = this.appointmentSvc.updateAppointment(this.id, this.appStatusForm.value);
    alert('Appointment Updated successfully');
    this.router.navigate(['/appointments']);
  }

  closeAppointment(){
    this.appStatusForm.patchValue({
      status: 'COMPLETE'
    });
    if(!this.appStatusForm.get('cashRcvDate').value)
      this.appStatusForm.controls['cashRcvDate'].setValue(new Date());

    this.customFormateDate();
    console.log(this.appStatusForm.value);
    let result = this.appointmentSvc.updateAppointment(this.id, this.appStatusForm.value);
    alert('Appointment Closed successfully');
    this.router.navigate(['/appointments']);
  }

  deleteAppointment(){
    const dialogRef = this.dialog.open(AppointmentNewComponent);
    
    dialogRef.afterClosed().subscribe(confirm => {
      if(confirm){
        let result = this.appointmentSvc.deleteAppointment(this.id);
        alert('Appointment Deleted successfully');
        this.router.navigate(['/appointments']);
      }
    });
  }

  createAppointment(){
    this.customFormateDate();

    let result = this.appointmentSvc.createAppointment(this.appStatusForm.value);
    this.updateInventories();
    alert('Appointment Added successfully');
    this.router.navigate(['/appointments']);
  }

  private customFormateDate(){
    let callDateStr = this.appStatusForm.get('callDate').value ? 
                        this.appStatusForm.get('callDate').value.toLocaleDateString() : '';
    let appointmentDateStr = this.appStatusForm.get('appointmentDate').value ?
                          this.appStatusForm.get('appointmentDate').value.toLocaleDateString() : '';
    let cashRcvDateStr = this.appStatusForm.get('cashRcvDate').value ?
                          this.appStatusForm.get('cashRcvDate').value.toLocaleDateString() : '';
    
    this.appStatusForm
      .patchValue({
        callDate: '', 
        appointmentDate: '',
        cashRcvDate: '', 
        callDateStr: callDateStr, 
        appointmentDateStr: appointmentDateStr,
        cashRcvDateStr: cashRcvDateStr 
      });
  }

  private updateInventories(){
    let sparesArr = this.appStatusForm.get('spares').value;
    
    if(sparesArr){
      sparesArr.forEach(x => {
        let inv: any = {};
        if(x.spareName){
          this.inventorySvc.getBySpareName(x.spareName).take(1)
            .subscribe(records=>{
              inv = records;
              inv.forEach(y=>{
                console.log(y.spareName, y.quantity, y.$key);
                this.inventorySvc.updateInventoryCount(y.$key, y.quantity-1);
              });
            })
        }
      });
    }
  }

  //Temporary - need to remove
  private sampleLoadValues(){
    this.appStatusForm
    .patchValue({
      customerName: 'AAtest',
      callDate: new Date('11/14/2017'),
      address: 'Tirupur',
      locality: 'Salem',
      phone: '8870960964',
    
      visitType: 'INSTALLATION',
      staff: 'Anand',
      productType: 'Chimney',
      brand: 'Faber',
      appointmentDate: new Date('11/15/2017'),
      appointmentTime: '9:30AM',
      status: 'PENDING'
    });
  }

  resetAppointmentForm(){
    console.log('Resetting');
  }
  
}