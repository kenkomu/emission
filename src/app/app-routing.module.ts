import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AppComponent } from './app.component';
import { MonitoringComponent } from './monitoring/monitoring.component';

const routes: Routes = [
 
  { path: 'monitoring', component: MonitoringComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
