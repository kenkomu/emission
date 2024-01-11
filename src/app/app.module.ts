import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ChartModule } from 'angular-highcharts';
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component';
import { SensorDataService } from './aws-api.service';
import {  HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more.src';
import * as HighchartsSolidGauge from 'highcharts/modules/solid-gauge';
import { HighchartsChartModule } from "highcharts-angular";
import { MonitoringComponent } from './monitoring/monitoring.component';

@NgModule({
  declarations: [
    AppComponent,
    MonitoringComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartModule,
    HighchartsChartModule 
  ],
  providers: [SensorDataService, { provide: HIGHCHARTS_MODULES, useFactory: () => [HighchartsMore, HighchartsSolidGauge] }],
  bootstrap:  [AppComponent]
})
export class AppModule { }
