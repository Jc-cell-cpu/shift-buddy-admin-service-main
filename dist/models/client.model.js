"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentsSchema = exports.medicalInfoSchema = void 0;
const mongoose_1 = require("mongoose");
const clientPersonSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    clientNotes: { type: String },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    profileImage: { type: String },
    typeOfCare: { type: String },
}, { _id: false });
const clientRelationSchema = new mongoose_1.Schema({
    relativeName: { type: String, required: true },
    relativeRelation: { type: String, required: true },
    relativeNumber: { type: String },
}, { _id: false });
const addressSchema = new mongoose_1.Schema({
    street: String,
    suburb: String,
    state: String,
    postCode: String,
}, { _id: false });
exports.medicalInfoSchema = new mongoose_1.Schema({
    diagnoses: { type: String },
    allergy: [{ type: String }],
    medicationAndTime: [{ type: String }],
    mobilityNotes: { type: String },
    emergencyPlan: { type: String },
}, { _id: false });
exports.documentsSchema = new mongoose_1.Schema({
    medicalDoc: { type: [String], default: [] },
    complianceDoc: { type: [String], default: [] }
}, { _id: false });
const ndisSchema = new mongoose_1.Schema({
    ndisNumber: String,
    ndisType: String,
}, { _id: false });
const clientSchema = new mongoose_1.Schema({
    clientId: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: String, required: true },
    documents: { type: exports.documentsSchema, required: true },
    status: { type: Boolean, default: true },
    carrierId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Carrier', required: true },
    repeatId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Repeat', required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    personalInfo: { type: clientPersonSchema, required: true },
    relationInfo: { type: clientRelationSchema, required: true },
    address: { type: addressSchema },
    medicalInfo: { type: exports.medicalInfoSchema, required: true },
    ndis: { type: ndisSchema, required: true },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Client', clientSchema);
