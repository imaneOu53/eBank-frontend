import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CustomerService} from "../services/customer.service";
import {catchError, Observable, throwError} from "rxjs";
import {Customer} from "../model/customer.model";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit{
  customers! :Observable<Array<Customer>>;
  errorMessage! : string ;
  searchFormGroup! : FormGroup;
  constructor(private customerService : CustomerService , private fb : FormBuilder, private router : Router) { }
  ngOnInit(): void {
    this.searchFormGroup= this.fb.group({
      keyword : this.fb.control("")
    });
    this.customers=this.customerService.getCustomers().pipe(catchError(err => {
      this.errorMessage = err.message;
        return throwError(err);
      })
    );

  }


  handleSearchCustomers() {
    let kw=this.searchFormGroup?.value.keyword;
    this.customers=this.customerService.searchCustomers(kw).pipe(catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    this.customerService.deleteCustomer(c.id).subscribe({
      next: (data => {
        this.handleSearchCustomers()
      }),
      error: err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/" + customer.id, {state : customer})

  }
}
