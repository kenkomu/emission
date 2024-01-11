/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type SensorData = {
  __typename: "SensorData",
  sensor_id?: string | null,
  methane_concentration?: number | null,
  carbon_concentration?: number | null,
  timestamp?: string | null,
};

export type GetSensorDataQuery = {
  getSensorData?:  Array< {
    __typename: "SensorData",
    sensor_id?: string | null,
    methane_concentration?: number | null,
    carbon_concentration?: number | null,
    timestamp?: string | null,
  } | null > | null,
};
