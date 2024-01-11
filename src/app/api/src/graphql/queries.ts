/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getSensorData = /* GraphQL */ `query GetSensorData {
  getSensorData {
    sensor_id
    methane_concentration
    carbon_concentration
    timestamp
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetSensorDataQuery,
  APITypes.GetSensorDataQuery
>;
