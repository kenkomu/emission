import { Component, ChangeDetectorRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { SensorDataService } from './aws-api.service';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
HC_more(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'emissionInsight';
  sensorData: any = {};
  sensorDataList: any[] = [];
  private carbonValue: number = 0;
  private methaneValue: number = 0;
  carbonChart!: Chart;
  methaneChart!: Chart;
  lineChart!: Chart;
  maxMethane: number = 0;
  minMethane: number = 0;
  avgMethane: number = 0;
  maxCarbon: number = 0;
  minCarbon: number = 0;
  avgCarbon: number = 0;

  constructor(
    private sensorDataService: SensorDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setupGaugeCharts();
    this.loadSensorData(); // Load data from local storage on initialization
    this.updateData();
    setInterval(() => this.reload(), 300000);
    this.cdr.detectChanges();
  }

  private reload() {
    window.location.reload();
  }

  async updateData() {
    try {
      this.sensorData = await this.sensorDataService.list();
      const latestSensorData = this.sensorData.getSensorData[0];
  
      this.sensorDataList.push({
        timestamp: latestSensorData.timestamp,
        carbon_concentration: latestSensorData.carbon_concentration,
        methane_concentration: latestSensorData.methane_concentration
      });
  
      this.carbonValue = latestSensorData.carbon_concentration || 0;
      this.methaneValue = latestSensorData.methane_concentration || 0;
  
      // Save updated data to local storage
      this.saveSensorData();
  
      setTimeout(() => {
        this.updateMethaneChart();
        this.updateCarbonChart();
        this.updateLineChart();
        
        // Update statistics after updating charts
        this.updateStatistics();
      }, -1000);
    } catch (error) {
      console.error(error);
    }
  }
  
  private calculateStatistics() {
    const methaneValues = this.sensorDataList.map(data => data.methane_concentration);
    const carbonValues = this.sensorDataList.map(data => data.carbon_concentration);

    this.maxMethane = Math.max(...methaneValues);
    this.minMethane = Math.min(...methaneValues);
    this.avgMethane = this.calculateAverage(methaneValues);

    this.maxCarbon = Math.max(...carbonValues);
    this.minCarbon = Math.min(...carbonValues);
    this.avgCarbon = this.calculateAverage(carbonValues);
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }

  private updateStatistics() {
    this.calculateStatistics();
  }

  setupGaugeCharts() {
    // Create a gauge chart for carbon
    this.carbonChart = new Chart({
      chart: {
        type: 'solidgauge', 
        backgroundColor: '#040D12',
      },
      credits: {
        enabled: false
    },
      
      title: {
        text: 'Carbon Concentration (ppm)',
        style: {
          fontSize: '24px',
          fontWeight: '100',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif'
        }
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        size: '140%',
        center: ['50%', '85%'],
        
  

      },          
      yAxis: {
        min: 0,
        max: 1000,  
        tickPosition: 'outside',
        lineColor: '#000000',
        lineWidth: 2,
        labels: {
          distance: 12,
          rotation: 360
        },
        offset: -20,
        endOnTick: true,
        stops: [
          [0.1, '#1A5D1A'], // green at 10%
          [0.5, '#F4CE14'], // yellow at 50%
          [0.9, '#B31312'] 
        ]
      },
      series: [{  
        name: 'Carbon',
       data: [0],
        dataLabels: {

          backgroundColor: {
            linearGradient: {
              x1: 2,
              y1: 3,
              x2: 4,
              y2: 1
            },
            stops: [
              [0.1, '#040D12'], 
               
            ]
          } 
        },
        tooltip: {
          valueSuffix: '% CO2'
        }
        
      }]as any
    });
    

    // Create a gauge chart for methane
    this.methaneChart = new Chart({
      chart: {
        type: 'solidgauge',
        backgroundColor: '#040D12',
        
    
        
      },
      credits: {
        enabled: false
    },
      
      title: {
        text: 'Methane Concentration (ppm)',
        style: {
          fontSize: '24px',
          fontWeight: '100',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif'
        }
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        size: '140%',
        center: ['50%', '85%'],
        
  

      },        
      yAxis: {
        min: 0,
        max: 100,  
        tickPosition: 'outside',
        lineColor: '#000000',
        lineWidth: 2,
        labels: {
          distance: 12,
          rotation: 360
        },
        offset: -20,
        endOnTick: true,
        stops: [
          [0.1, '#1A5D1A'], // green at 10%
          [0.5, '#F4CE14'], // yellow at 50%
          [0.9, '#B31312'] 
        ]
      },
      series: [{  
        name: 'Methane',
        data: [0],
        dataLabels: {

          backgroundColor: {
            linearGradient: {
              x1: 2,
              y1: 3,
              x2: 4,
              y2: 1
            },
            stops: [
              [0.1, '#040D12'], 
               
            ]
          } 
        },
        tooltip: {
          valueSuffix: '% CO2'
        }
        
      }] as any
    });
    this.lineChart = new Chart({
      chart: {
        type: 'line',
        backgroundColor: '#040D12',
        borderRadius: 10,
        // spacing: [10, 10, 15, 10], // top, right, bottom, left
        plotBorderColor: '#1A1A1D',
        plotBorderWidth: 1,
        style: {
          fontFamily: 'Arial, sans-serif'
        },
        width: 500,
        height: 330,
      },
      
      credits: {
        enabled: false
      },
      title: {
        text: 'Sensor Data',
        style: {
          fontSize: '24px',
          fontWeight: '100',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif'
        }
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        lineColor: '#1A1A1D',
        tickColor: '#1A1A1D',
        labels: {
          style: {
            color: '#ffffff'
          }
        }
      },
      yAxis: {
        min: 200,
        max: 1500,
        color: '#1A1A1D',
        tickPosition: 'outside',
        lineColor: '#000000',
        lineWidth: 2,
        labels: {
          distance: 12,
          rotation: 360,
          style: {
            color: '#ffffff'
          }
        },
        offset: -20,
        endOnTick: true,
        stops: [
          [0.1, '#1A5D1A'], // green at 10%
          [0.5, '#F4CE14'], // yellow at 50%
          [0.9, '#B31312']
        ]
      },
      series: [{
        name: 'Methane',
        data: [0.2, 0.4, 0.6, 0.8, 1], // replace with your actual data
        color: '#4CAF50', // Green color for Methane
        lineWidth: 3,
        marker: {
          symbol: 'circle',
          radius: 6,
          fillColor: '#ffffff',
          lineWidth: 2,
          lineColor: '#4CAF50'
        },
        dataLabels: {
          backgroundColor: {
            linearGradient: {
              x1: 2,
              y1: 3,
              x2: 4,
              y2: 1
            },
            stops: [
              [0.1, '#040D12'],
            ]
          }
        },
        tooltip: {
          valueSuffix: '% Methane'
        }
      }, {
        name: 'CO2',
        data: [0.4, 0.7, 0.5, 0.3, 0.9], // replace with your actual data
        color: '#FFC107', // Yellow color for CO2
        lineWidth: 3,
        marker: {
          symbol: 'square',
          radius: 6,
          fillColor: '#ffffff',
          lineWidth: 2,
          lineColor: '#FFC107'
        },
        dataLabels: {
          backgroundColor: {
            linearGradient: {
              x1: 2,
              y1: 3,
              x2: 4,
              y2: 1
            },
            stops: [
              [0.1, '#040D12'],
            ]
          }
        },
        tooltip: {
          valueSuffix: '% CO2'
        }
      }] as any
    });
    
    this.cdr.detectChanges();

   
  }

  updateMethaneChart() {
    if (this.methaneChart && this.methaneChart.ref) {
      this.methaneChart.ref.series[0].setData([this.methaneValue], true);
      this.cdr.detectChanges();
    } else {
      console.error('Methane chart or its reference is undefined.');
    }
  }
  
  
  
  updateCarbonChart() {
    if (this.carbonChart && this.carbonChart.ref) {
      this.carbonChart.ref.series[0].setData([this.carbonValue]);
      this.carbonChart.ref.redraw();
      this.cdr.detectChanges();
    } else {
      console.error('Carbon chart or its reference is undefined.');
    }
  }
  updateLineChart() {
    if (this.lineChart && this.lineChart.ref) {
      const timestamps = this.sensorDataList.map(data => data.timestamp);
      const carbonData = this.sensorDataList.map(data => data.carbon_concentration);
      const methaneData = this.sensorDataList.map(data => data.methane_concentration);

      this.lineChart.ref.xAxis[0].setCategories(timestamps);
      this.lineChart.ref.series[0].setData(methaneData);
      this.lineChart.ref.series[1].setData(carbonData);

      this.cdr.detectChanges();
    } else {
      console.error('Line chart or its reference is undefined.');
    }
  }

  private saveSensorData() {
    // Save the sensor data list to local storage
    localStorage.setItem('sensorDataList', JSON.stringify(this.sensorDataList));
  }

  private loadSensorData() {
    // Load the sensor data list from local storage
    const storedData = localStorage.getItem('sensorDataList');
    if (storedData) {
      this.sensorDataList = JSON.parse(storedData);
    }
  }
  clearLocalStorage() {
    localStorage.removeItem('sensorDataList');
    // After removing the item, you might want to reset your component state as well
    this.sensorDataList = [];
    this.lineChart.ref?.series.forEach(series => series.setData([], false));
    this.lineChart.ref?.xAxis[0].setCategories([], false);
    this.cdr.detectChanges();
  }
}

