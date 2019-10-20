import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material';

// Components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ActionComponent } from './components/action/action.component';
import { MeComponent } from './components/me/me.component';
import { BugComponent } from './components/bug/bug.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';

// Includes
import { ActionFormComponent } from './includes/action-form/action-form.component';
import { TimePickerComponent } from './includes/time-picker/time-picker.component';
import { ActionEditComponent } from './includes/action-edit/action-edit.component';
import { ConfirmationComponent } from './includes/confirmation/confirmation.component';

@NgModule({
  declarations: [DashboardComponent, ActionComponent, ActionFormComponent, TimePickerComponent, MeComponent, BugComponent, UsersComponent, ActionEditComponent, ConfirmationComponent, UserComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'action', component: ActionComponent },
      { path: 'me', component: MeComponent },
      { path: 'users', component: UsersComponent },
      { path: 'user/:id', component: UserComponent },
      { path: 'bug', component: BugComponent },
      { path: '**', redirectTo: '/panel/dashboard' }
    ])
  ],
  exports: [RouterModule],
  entryComponents: [ActionFormComponent, ActionEditComponent, ConfirmationComponent]
})
export class MainModule { }
