// top of file
import { API,  GraphQLResult } from '@aws-amplify/api';
import config from './src/aws-exports';
import { getSensorData } from './src/graphql/queries';
import { GetSensorDataQuery  } from './src/API';


API.configure(config);


    async function list() {
        try {
          const response: GraphQLResult<GetSensorDataQuery> = (await API.graphql({
            query: getSensorData,
            variables: {
              // <your variables, optional>
            }
          })) as GraphQLResult<GetSensorDataQuery>;
      
          if (response.data) {
            const responseData: GetSensorDataQuery = response.data;
            console.log(responseData);
          } else {
            console.error('No data in the response.');
          }
        } catch (error) {
          console.error(error);
        }
      }
      
      list();
  