import mongoose, { Document, Model } from "mongoose";

enum DnoSubstationStatusEnum {
  GREEN = "green",
  AMBER = "amber",
  RED = "red",
}

enum TenureEnum {
  LEASEHOLD = "leasehold",
  FREEHOLD = "freehold",
}

interface Property {
  uprn: string;
  address_1: string;
  address_2: string;
  address_3: string;
  postcode: string;
  asset_rating: number;
  asset_rating_band: string;
  floor_area: number;
  building_level: number;
  main_heating_fuel: string;
  county: string;
  title_number: string;
  tenure: TenureEnum;
  company_registration_number: string;
  roof_surface: number;
  annual_energy_usage: number;
  latitude: number;
  longitude: number;
  building_emissions: number;
  yield_potential: number;
  dno_substation_status: DnoSubstationStatusEnum;
  potential_energy_savings: number;
}

export interface PropertyDocument extends Property, Document {
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema<PropertyDocument>(
  {
    uprn: {
      type: String,
      required: true,
    },
    address_1: {
      type: String,
      required: true,
    },
    address_2: {
      type: String,
      required: false,
    },
    address_3: {
      type: String,
      required: false,
    },
    postcode: {
      type: String,
      required: true,
    },
    asset_rating: {
      type: Number,
      required: true,
    },
    asset_rating_band: {
      type: String,
      required: true,
    },
    floor_area: {
      type: Number,
      required: true,
    },
    building_level: {
      type: Number,
      required: true,
    },
    main_heating_fuel: {
      type: String,
      required: true,
    },
    county: {
      type: String,
      required: true,
    },
    title_number: {
      type: String,
      required: true,
    },
    tenure: {
      type: String,
      required: true,
    },
    company_registration_number: {
      type: String,
      required: true,
    },
    roof_surface: {
      type: Number,
      required: true,
    },
    annual_energy_usage: {
      type: Number,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    building_emissions: {
      type: Number,
      required: true,
    },
    yield_potential: {
      type: Number,
      required: true,
    },
    dno_substation_status: {
      type: String,
      required: true,
    },
    potential_energy_savings: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PropertyModel: Model<PropertyDocument> =
  mongoose.models?.properties || mongoose.model("properties", propertySchema);

export default PropertyModel;
