import { SimulationMap } from "./SimulationMap";

export interface Simulation {
  name: string,
  maps_count: number,
  node_min: number,
  node_max: number,
  maps?: SimulationMap[]
}