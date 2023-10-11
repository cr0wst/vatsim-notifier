import axios from "axios";
import config from "./config";

export async function fetchData(): Promise<VatsimData> {
  const response = await axios.get(config.VATSIM_DATA_ENDPOINT);
  return await response.data;
}

/**
 * This is the data returned from the VATSIM Data endpoint.
 */
type VatsimData = {
  ratings: {
    "id": number,
    "short": string,
    "long": string
  }[],
  facilities: {
    "id": number,
    "short": string,
    "long": string
  }[],
  controllers:
    {
      cid: number,
      name: string,
      callsign: string,
      frequency: string,
      facility: number,
      rating: number,
      server: string,
      visual_range: number,
      text_atis: string[],
      last_updated: string,
      logon_time: string
    }[],
}