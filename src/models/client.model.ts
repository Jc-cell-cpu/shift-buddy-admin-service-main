import { Document, model, Schema, Types } from 'mongoose';

//CLIENT PERSONAL INFO
export interface IClientPersonalInfo extends Document {
  name: string;
  gender: string;
  dob: Date;
  clientNotes: string;
  email: string;
  mobileNumber: string;
  profileImage: string;
  typeOfCare: string;
}

const clientPersonSchema = new Schema<IClientPersonalInfo>({
  name: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  clientNotes: { type: String },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  profileImage: { type: String },
  typeOfCare: { type: String },
},{ _id: false });

//CLIENT RELATION INFO

export interface IClientRelationInfo extends Document {
  relativeName: string;
  relativeRelation: string;
  relativeNumber: string;
}

const clientRelationSchema = new Schema<IClientRelationInfo>({
  relativeName: { type: String, required: true },
  relativeRelation: { type: String, required: true },
  relativeNumber: { type: String },
},{ _id: false });

//ADDRESS
export interface IAddress {
  street?: string;
  suburb?: string;
  state?: string;
  postCode?: string;
}

const addressSchema = new Schema<IAddress>({
  street: String,
  suburb: String,
  state: String,
  postCode: String,
}, { _id: false });

//MEDICAL INFO

export interface IMedicalInfo {
  diagnoses?: string;
  allergy?: string[];
  medicationAndTime?: string[];
  mobilityNotes?: string;
  emergencyPlan?: string;
}

export const medicalInfoSchema = new Schema<IMedicalInfo>(
  {
    diagnoses: { type: String },
    allergy: [{ type: String }],
    medicationAndTime: [{ type: String }],
    mobilityNotes: { type: String },
    emergencyPlan: { type: String },
  },
  { _id: false }
);



//Documents

interface IClientDocuments {
  medicalDoc: string[];
  complianceDoc: string[];
}

export const documentsSchema = new Schema<IClientDocuments>(
  {
    
    medicalDoc: { type: [String], default: [] },
    complianceDoc: { type: [String], default: [] }
  
  },
  { _id: false }
);


//NDIS
export interface Indis {
  ndisNumber?: string;
  ndisType?: string;
  
}

const ndisSchema = new Schema<Indis>({
  ndisNumber: String,
  ndisType: String,
  
}, { _id: false });

// Main Client Interface

export interface IClient extends Document {
  clientId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  duration: string;
  documents: IClientDocuments;
  status: boolean;
  carrierId: Types.ObjectId;
  repeatId: Types.ObjectId;
  createdBy?: Types.ObjectId;
  personalInfo: IClientPersonalInfo;
  relationInfo: IClientRelationInfo;
  address?: IAddress;
  medicalInfo: IMedicalInfo;
  ndis: Indis;

}

const clientSchema = new Schema<IClient>(
  {
    clientId: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: String, required: true },
    documents: { type: documentsSchema, required: true },
    status: { type: Boolean, default: true },
    carrierId: { type: Schema.Types.ObjectId, ref: 'Carrier', required: true },
    repeatId: { type: Schema.Types.ObjectId, ref: 'Repeat', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    personalInfo: { type: clientPersonSchema, required: true },
    relationInfo: { type: clientRelationSchema, required: true },
    address: { type: addressSchema },
    medicalInfo: { type: medicalInfoSchema, required: true },
    ndis: { type: ndisSchema, required: true },
  },
  { timestamps: true }
);

export default model<IClient>('Client', clientSchema);

