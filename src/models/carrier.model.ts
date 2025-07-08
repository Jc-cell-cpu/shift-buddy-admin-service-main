import { Document, Schema, Types, model } from 'mongoose';

// Token Subdocument
export interface IToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  isActive: boolean;
}

const tokenSchema = new Schema<IToken>({
  accessToken: String,
  refreshToken: String,
  expiresAt: Date,
  isActive: { type: Boolean, default: true }
}, { _id: false });

// Contact Person Subdocument
export interface IContactDetails {
  

  emergencyContactNumber: string;
  familyMemberName: string;
  familyMemberRelation?: string;
}

const contactDetailsSchema = new Schema<IContactDetails>({


  emergencyContactNumber: { type: String },
  familyMemberName: { type: String },
  familyMemberRelation: { type: String },
}, { _id: false });

// Address Subdocument
export interface IAddress {
  street?: string;
  suburb?: string;
  state?: string;
  postalCode?: string;
}

const addressSchema = new Schema<IAddress>({
  street: String,
  suburb: String,
  state: String,
  postalCode: String,
}, { _id: false });

//additional details
export interface IaddDtails {
  taxFileNumber?: string;
  AbnNumber?: string;
  workersScreeningCheck?: string;
  workingWithChildernCheck?: string;
  policeCheck?: string;
  firstAid?: string;
}

const addDtailsSchema = new Schema<IaddDtails>({
  taxFileNumber: String,
  AbnNumber: String,
  workersScreeningCheck: String,
  workingWithChildernCheck: String,
  policeCheck: String,
  firstAid: String,
}, { _id: false });




//document upload  for carrier

export interface IDocumentItem {
  docId: string;
  expiryDate: string;
}

const documentItemSchema = new Schema<IDocumentItem>(
  {
    docId: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
  },
  { _id: false }
);

export interface ICarrierDocuments {
  uploadPoliceCheck: IDocumentItem;
  uploadFirstAidCertificate: IDocumentItem;
}

export const documentsSchema = new Schema<ICarrierDocuments>(
  {
    uploadPoliceCheck: { type: documentItemSchema, default: {} },
    uploadFirstAidCertificate: { type: documentItemSchema, default: {} },
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

// Main Carrier Interface
export interface ICarrier extends Document {
  carrierId : string,
  profileImage : string,
  email : string,
  mobileNumber : string,
  DOB : Date,
  name: string;
  password: string;
  gender: string;
  role: Types.ObjectId;
  createdBy?: Types.ObjectId;
  status: boolean;
  receiverEmail : string;
  createEmail : string;
  xeroEmployeeId : string;
  contactDetails?: IContactDetails;
  address?: IAddress;
  documents: ICarrierDocuments;
  additionalDetails: IaddDtails;
  ndis : Indis;
  
  webTokens?: IToken[];
  appTokens?: IToken[];
}

const carrierSchema = new Schema<ICarrier>({
  carrierId : {type: String, required: true , unique: true},
  profileImage : {type: String },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: (props: any) => `${props.value} is not a valid email`
    }
  },
  mobileNumber : {type: String, required: true},
  DOB: { type: Date, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true , default: '123456' },
  gender: { type: String, required: true },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: Boolean,
    default: true,
    required: true
  },
  receiverEmail: {
  type: String,
  lowercase: true,
  trim: true,
  validate: {
    validator: (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
    message: (props: any) => `${props.value} is not a valid email`
  }
},
  createEmail: {
  type: String,
  lowercase: true,
  trim: true,
  validate: {
    validator: (v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
    message: (props: any) => `${props.value} is not a valid email`
  }
},
  xeroEmployeeId: { type: String },
  contactDetails :  { type: contactDetailsSchema, default: () => ({}) } ,
  address: { type: addressSchema, default: () => ({}) } ,
  documents: { type: documentsSchema, default: () => ({}) } ,
  additionalDetails : { type: addDtailsSchema, default: () => ({}) } ,
  ndis : { type: ndisSchema, default: () => ({}) } ,
  webTokens: [tokenSchema],
  appTokens: [tokenSchema]
}, { timestamps: true });

export default model<ICarrier>('Carrier', carrierSchema);
