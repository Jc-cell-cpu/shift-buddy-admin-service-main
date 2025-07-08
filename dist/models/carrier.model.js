"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsSchema = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
    isActive: { type: Boolean, default: true }
}, { _id: false });
const contactDetailsSchema = new mongoose_1.Schema({
    emergencyContactNumber: { type: String },
    familyMemberName: { type: String },
    familyMemberRelation: { type: String },
}, { _id: false });
const addressSchema = new mongoose_1.Schema({
    street: String,
    suburb: String,
    state: String,
    postalCode: String,
}, { _id: false });
const addDtailsSchema = new mongoose_1.Schema({
    taxFileNumber: String,
    AbnNumber: String,
    workersScreeningCheck: String,
    workingWithChildernCheck: String,
    policeCheck: String,
    firstAid: String,
}, { _id: false });
const documentItemSchema = new mongoose_1.Schema({
    docId: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
}, { _id: false });
exports.documentsSchema = new mongoose_1.Schema({
    uploadPoliceCheck: { type: documentItemSchema, default: {} },
    uploadFirstAidCertificate: { type: documentItemSchema, default: {} },
}, { _id: false });
const ndisSchema = new mongoose_1.Schema({
    ndisNumber: String,
    ndisType: String,
}, { _id: false });
const carrierSchema = new mongoose_1.Schema({
    carrierId: { type: String, required: true, unique: true },
    profileImage: { type: String },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valid email`
        }
    },
    mobileNumber: { type: String, required: true },
    DOB: { type: Date, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true, default: '123456' },
    gender: { type: String, required: true },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valid email`
        }
    },
    createEmail: {
        type: String,
        lowercase: true,
        trim: true,
        validate: {
            validator: (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
            message: (props) => `${props.value} is not a valid email`
        }
    },
    xeroEmployeeId: { type: String },
    contactDetails: { type: contactDetailsSchema, default: () => ({}) },
    address: { type: addressSchema, default: () => ({}) },
    documents: { type: exports.documentsSchema, default: () => ({}) },
    additionalDetails: { type: addDtailsSchema, default: () => ({}) },
    ndis: { type: ndisSchema, default: () => ({}) },
    webTokens: [tokenSchema],
    appTokens: [tokenSchema]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Carrier', carrierSchema);
