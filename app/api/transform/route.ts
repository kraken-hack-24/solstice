"use server";
import PropertyModel from "../../models/property.model";
import { connectToMongoDB } from "../../libs/mongodb.lib";
import { NextResponse } from "next/server";
import https from "https";
import csvParser from "csv-parser";
import fs from "fs/promises";
import { Readable } from "stream";

type LatLng = {
  lat: number;
  lng: number;
};

type BuildingInsightsRequest = LatLng & {};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

type ImageryDate = {
  year: number;
  month: number;
  day: number;
};

type BoundingBox = {
  sw: Coordinate;
  ne: Coordinate;
};

type WholeRoofStats = {
  areaMeters2: number;
  sunshineQuantiles: number[];
  groundAreaMeters2: number;
};

type RoofSegmentSummaries = {
  pitchDegrees: number;
  azimuthDegrees: number;
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  segmentIndex: number;
};

type SolarPanelConfigs = {
  panelsCount: number;
  yearlyEnergyDcKwh: number;
  roofSegmentSummaries: RoofSegmentSummaries[];
};

type RoofSegmentStats = {
  pitchDegrees: number;
  azimuthDegrees: number;
  stats: WholeRoofStats;
  center: Coordinate;
  boundingBox: BoundingBox;
  planeHeightAtCenterMeters: number;
};

type SolarPotential = {
  maxArrayPanelsCount: number;
  maxArrayAreaMeters2: number;
  maxSunshineHoursPerYear: number;
  carbonOffsetFactorKgPerMwh: number;
  wholeRoofStats: WholeRoofStats;
  roofSegmentStats: RoofSegmentStats[];
  solarPanelConfigs: SolarPanelConfigs[];
  panelCapacityWatts: number;
  panelHeightMeters: number;
  panelWidthMeters: number;
  panelLifetimeYears: number;
  buildingStats: WholeRoofStats;
};

type GoogleSolarData = {
  name: string;
  center: Coordinate;
  imageryDate: ImageryDate;
  regionCode: string;
  solarPotential: SolarPotential;
  boundingBox: BoundingBox;
  imageryQuality: string;
  imageryProcessedDate: ImageryDate;
};

interface ICenter {
  location: {
    lat: number;
    lng: number;
  };
}

const imageQualities = ["HIGH", "MEDIUM", "LOW"];

/**
 *
 */
export const POST = async () => {
  await connectToMongoDB();
  const pageSize = 1000;

  try {
    const buffer = await getBufferFromFile();
    const csvData = await getCsvContent(buffer);
    const structuredList = await structurePropertyCsvData(csvData);
    console.log(structuredList, "HERE IN POST");

    const paginatedData = paginateArray(structuredList, pageSize);

    for (let page = 0; page < paginatedData.length; page++) {
      const currentPage = paginatedData[page];
      console.log(currentPage, "CURR PAGE");

      await PropertyModel.insertMany(currentPage);
      console.info(`[ MERGED DATA ] Page finished: ${page}`);
    }

    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: (err as any).message },
      { status: 400 }
    );
  }
};

const getBuildingInsights = async (
  req: BuildingInsightsRequest,
  qualityIndex: number = 0
): Promise<GoogleSolarData> => {
  try {
    const resource = "buildingInsights:findClosest";

    const defaultParams = getDefaultQueryParams(
      {
        lat: req.lat,
        lng: req.lng,
      },
      imageQualities[qualityIndex]
    );

    const url = `${process.env.GOOGLE_SOLAR_API_URL}/${resource}?${defaultParams}`;

    let res = await fetch(url);

    if (res.status === 404) {
      return getBuildingInsights(req, qualityIndex + 1);
    }

    const solarData = (await res.json()) as GoogleSolarData;

    return solarData;
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

const getDefaultQueryParams = (
  latLng: LatLng,
  imageQuality: string = "HIGH"
): string => {
  const latitude = latLng.lat.toFixed(5);
  const longitude = latLng.lng.toFixed(5);
  return `location.latitude=${latitude}&location.longitude=${longitude}&requiredQuality=${imageQuality}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
};

const getCoordinates = (postal_code: string): any => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${postal_code}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let rawData = "";

      res.on("data", (chunk) => {
        rawData += chunk;
      });

      res.on("end", () => {
        try {
          resolve(JSON.parse(rawData));
        } catch (err) {
          // @ts-ignore
          reject(new Error(err));
        }
      });
    });

    req.on("error", (err) => {
      // @ts-ignore
      reject(new Error(err));
    });
  });
};

const getBufferFromFile = async () => {
  console.log(process.cwd(), "HERE");
  const buffer = await fs.readFile(
    "/Users/wwwhatley/Developer/kraken/solstice/public/merged_data_sample.csv"
  );
  return buffer;
};

/**
 *
 */
const getCsvContent = async (buffer: Buffer): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const data: any[] = [];
    Readable.from(buffer)
      .pipe(csvParser())
      .on("data", (row) => {
        return data.push({
          uprn: row["UPRN"],
          address_1: row["Matching Address"],
          address_2: "",
          address_3: row["POSTTOWN"],
          postcode: row["Postcode"],
          asset_rating: row["ASSET_RATING"],
          asset_rating_band: row["ASSET_RATING_BAND"],
          floor_area: row["FLOOR_AREA"],
          building_level: row["BUILDING_LEVEL"],
          main_heating_fuel: row["MAIN_HEATING_FUEL"],
          title_number: row["Title Number"],
          tenure: row["Tenure"],
          company_registration_number: row["Company Registration No. (1)"],
          building_emissions: row["BUILDING_EMISSIONS"],
        });
      })
      .on("end", () => {
        console.log("RESOLVED", data);
        resolve(data);
      })
      .on("error", (error) => {
        console.log(error, "ERROR");
        reject(error);
      });
  });
};

const structurePropertyCsvData = async (properties: any[]) => {
  const data = await Promise.all(
    properties.map(async (key) => {
      const geocode_response = await getCoordinates(key.postcode);

      if (!geocode_response || geocode_response.status === "ZERO_RESULTS")
        return null;

      const coordinates: LatLng =
        geocode_response?.results[0]?.geometry?.location;

      if (!coordinates) return null;

      const solarData = await getBuildingInsights({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });

      if (!solarData) return null;

      const full_roof_panel_config_object =
        solarData?.solarPotential?.solarPanelConfigs.pop();
      const yield_potential = full_roof_panel_config_object?.yearlyEnergyDcKwh;

      return {
        ...key,
        total_roof_surface_area:
          solarData?.solarPotential?.wholeRoofStats?.areaMeters2,
        max_installable_surface_area:
          solarData?.solarPotential?.maxArrayAreaMeters2,
        max_panel_count: solarData?.solarPotential.maxArrayPanelsCount,
        latitude: solarData?.center?.latitude,
        longitude: solarData?.center?.longitude,
        yield_potential,
      };
    })
  );

  return data.filter((item) => item !== null);
};

/**
 *
 */
const paginateArray = (arr: any, size: number): any[][] => {
  return arr.reduce((acc: any, val: any, i: number) => {
    let idx = Math.floor(i / size);
    let page = acc[idx] || (acc[idx] = []);
    page.push(val);
    return acc;
  }, []);
};
