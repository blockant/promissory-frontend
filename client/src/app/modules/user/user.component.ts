import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/services/auth.service';
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  users: any = []
  constructor(public dialog: MatDialog, private auth: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateUserComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createUser(result)
      }
    });
  }


  async getUsers() {
    try {
      const result: any = await this.auth.getUsers()
      this.users = result.users
    } catch (e) {
      console.log(e)
    }
  }


  async createUser(user: object) {
    try {
      await this.auth.createUser(user)
      this.toastr.success('User Created Successfully')
      this.getUsers()
    } catch (e) {
      console.log(e)
    }
  }

}
