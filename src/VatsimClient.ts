import axios from "axios";

export async function fetchControllers(): Promise<Controller[]> {
  const response = await axios.get("https://data.vatsim.net/v3/vatsim-data.json");
  const data = await response.data;

  if (data && data.controllers) {
    return data.controllers.map((controller: any) => {
      return {
        cid: controller.cid,
        name: controller.name,
        callsign: controller.callsign,
        frequency: controller.frequency,
        facility: data.facilities.find((f: any) => f.id == controller.facility),
        rating: data.ratings.find((r: any) => r.id == controller.rating),
      };
    });
  }
  return [];
}

/**
 * This is the data returned from the VATSIM Data endpoint.
 */
type VatsimData = {
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
      text_atis: string,
      last_updated: string,
      logon_time: string
    }[],
  ratings: {
    "id": number,
    "short": string,
    "long": string
  }[],
  facilities: {
    "id": number,
    "short": string,
    "long": string
  }
}

/**
 * This is the same data, but it's undergone a few normalizations to make it easier to use for differencing.
 */
export type Controller = {
  cid: number,
  name: string,
  callsign: string,
  frequency: string,
  facility: {
    id: number,
    short: string,
    long: string
  },
  rating: {
    id: number,
    short: string,
    long: string
  },
};