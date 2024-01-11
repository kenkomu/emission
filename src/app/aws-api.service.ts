import { Injectable } from '@angular/core';
import { GraphQLResult } from '@aws-amplify/api';  // Import generateClient and Amplify
import config from './api/src/aws-exports';
import { getSensorData } from './api/src/graphql/queries';
import { GetSensorDataQuery } from './api/src/API';
import { generateClient } from 'aws-amplify/api'  
import { Amplify } from 'aws-amplify'

@Injectable({
  providedIn: 'root'
})
export class SensorDataService {
  constructor() {
    Amplify.configure(config);  // Configure Amplify with your AWS configuration
  }

  async list(): Promise<GetSensorDataQuery> {
    try {
      const client = generateClient();  // Create a client using generateClient()

      const response: GraphQLResult<GetSensorDataQuery> = await client.graphql({
        query: getSensorData,
        variables: {
          // <your variables, optional>
        }
      });

      console.log('Response from API: ', response);

      if (response.data) {
        return response.data;
      } else {
        console.error('No data in the response.');
        return {}; // Return an empty object or handle the error as needed
      }
    } catch (error) {
      console.error('Error in list:', error);
      throw error; // Rethrow the error for the component to handle
    }
  }
}