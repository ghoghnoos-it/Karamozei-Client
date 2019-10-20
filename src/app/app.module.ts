import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material';

import { LoggedinGuard, NotLoggedinGuard } from './gurds/loggedin/loggedin.guard';

import { AppComponent } from './app.component';
import { HeaderComponent } from './includes/header/header.component';
import { BugComponent } from './includes/bug/bug.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    BugComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot([
      { path: '', canActivate: [NotLoggedinGuard], loadChildren: './modules/auth/auth.module#AuthModule' },
      { path: 'panel', canActivate: [LoggedinGuard], loadChildren: './modules/main/main.module#MainModule' },
      { path: '**', redirectTo: '/' }
    ]),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [BugComponent]
})
export class AppModule { }
