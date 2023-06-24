import {Component, OnInit} from '@angular/core';
import {Form, FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {Observable} from "rxjs";
import {AccountDetails} from "../model/account.model";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  accountFormGroup !: FormGroup;
  currentPage: number = 0;
  pageSize: number = 5;

  accountObservable!: Observable<AccountDetails>
  operationFormGroup!: FormGroup


  constructor(private fb: FormBuilder, private accountservice: AccountsService) {
  }

  ngOnInit(): void {
    this.accountFormGroup = this.fb.group({
      accountId: this.fb.control('')
    });
    this.operationFormGroup = this.fb.group({
      operationType: this.fb.control(null),
      amount: this.fb.control(null),
      description: this.fb.control(''),
      accountDestination: this.fb.control(null)
    })
  }


  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountservice.getAccount(accountId, this.currentPage, this.pageSize);
    console.log(this.currentPage);
    this.accountObservable.subscribe(data => {
      console.log(JSON.stringify(data));
    });
    console.log("next page");
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
    console.log("page changed !");
  }

  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFormGroup.value.operationType;
    let amount = this.operationFormGroup.value.amount;
    let description = this.operationFormGroup.value.description;
    let accountDestination = this.operationFormGroup.value.accountDestination;

    if (operationType == 'DEBIT') {
      this.accountservice.debit(accountId, amount, description).subscribe({
        next: (data => {
          alert("Success Debit!")
          this.operationFormGroup.reset();
          this.handleSearchAccount()
        }),
        error : (err => {
          alert("Operation ERROR!")
        })
      })

    } else if (operationType == 'CREDIT') {
      this.accountservice.credit(accountId, amount, description).subscribe({
        next: (data => {
          alert("Succes Credit!")
          this.operationFormGroup.reset();
          this.handleSearchAccount()
        }),
        error : (err => {
          console.log(err)
        })
      })

    } else if (operationType == 'TRANSFER') {
      this.accountservice.transferer(accountDestination, accountId, amount).subscribe({
        next: (data => {
          alert("Transfer TO " + accountDestination + " Done!")
          this.operationFormGroup.reset();
          this.handleSearchAccount()
        }),
        error : (err => {
          alert("Oparation ERROR!")
        })
      })
    }
  }

  //méthode pour choisir la valeur de radio 'TRANSFER' et afficher le champ de input
  operationTypeFunction() {
    return this.operationFormGroup.value.operationType == 'TRANSFER';
  }
}

