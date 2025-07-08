"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCarrierAvailability = exports.updateCarrierStatus = exports.updateCarrier = exports.getCarrierById = exports.getCarriers = exports.createCarrier = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const slot_1 = require("../services/slot");
const xero_controller_1 = require("./xero.controller");
const createCarrier = async (req, res) => {
    try {
        if (req.user?.role_code != 'A') {
            res.status(400).json({ msg: 'You are unauthorized to view this page' });
            return;
        }
        const { profileImage, email, mobileNumber, DOB, name, gender, receiverEmail, createEmail, password, shiftTiming, employementType, contactDetails, address, ndis, additionalDetails, documents } = req.body;
        // Check if email already exists
        const existing = await models_1.Carrier.findOne({
            $or: [
                { "emailId": email },
                { "mobileNumber": mobileNumber }
            ]
        });
        if (existing) {
            res.status(400).json({ msg: 'Email or Mobile already exists' });
            return;
        }
        const carrierRoleId = (await models_1.Role.findOne({ roleCode: 'C' }))?._id;
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash(password || '123456', 10);
        // Get S3 file URL from multer-s3
        // const s3File = req.file as Express.Multer.File & { location?: string };
        //  let fileUrl:any = '';
        //     if (req.file) {
        //         fileUrl = await uploadToS3(req.file);
        //     }
        // const profileImageUrl = fileUrl;
        //   const profileImageUrl = req.file?.location || ''; // if no image, fallback to ''
        //create a random client ID
        let carrierId = Math.floor(100000 + Math.random() * 900000).toString();
        while (true) {
            const existing = await models_1.Carrier.findOne({ carrierId });
            if (existing) {
                carrierId = Math.floor(100000 + Math.random() * 900000).toString();
            }
            else {
                break;
            }
        }
        // Create carrier
        const newCarrier = new models_1.Carrier({
            carrierId,
            email,
            mobileNumber,
            profileImage,
            DOB,
            name,
            gender,
            receiverEmail,
            createEmail,
            shiftTiming,
            employementType,
            contactDetails,
            address,
            ndis,
            additionalDetails,
            documents,
            password: hashedPassword,
            role: carrierRoleId,
            createdBy: req.user.id,
            xeroEmployeeId: null
        });
        await newCarrier.save();
        //create carrier in xero 
        let result = await (0, xero_controller_1.createEmployeeInXeroAU)(req, res, newCarrier);
        if (result.status == true) {
            newCarrier.xeroEmployeeId = result.employeeId;
            await newCarrier.save();
            res.status(201).json({
                msg: 'Carrier created successfully and synced with Xero account',
                carrierId: newCarrier.carrierId
            });
        }
        //
        else {
            res.status(201).json({
                msg: 'Carrier created successfully but not synced with Xero account',
                carrierId: newCarrier.carrierId
            });
        }
    }
    catch (err) {
        console.error('Error creating carrier:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.createCarrier = createCarrier;
const getCarriers = async (req, res) => {
    try {
        if (req.user?.role_code !== 'A') {
            res.status(403).json({ msg: 'You are unauthorized to view this page' });
            return;
        }
        const { search = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 15 } = req.body;
        const query = {
            status: true,
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } }
            ]
        };
        const sortableFields = ['name', 'email', 'mobileNumber', 'createdAt'];
        const sortOptions = {};
        if (sortableFields.includes(sortBy)) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }
        else {
            sortOptions['createdAt'] = -1; // fallback
        }
        const total = await models_1.Carrier.countDocuments(query);
        const carriers = await models_1.Carrier.find(query)
            .select('-webTokens -appTokens -password -__v')
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        res.status(200).json({
            total,
            page: Number(page),
            limit: Number(limit),
            data: carriers
        });
    }
    catch (error) {
        console.error('Error fetching carriers:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.getCarriers = getCarriers;
const getCarrierById = async (req, res) => {
    try {
        if (req.user?.role_code !== 'A') {
            res.status(403).json({ msg: 'You are unauthorized to view this page' });
            return;
        }
        const { carrierId } = req.body;
        if (!carrierId) {
            res.status(400).json({ msg: 'Carrier ID is required' });
            return;
        }
        const carrier = await models_1.Carrier.findOne({ carrierId })
            .select('-webTokens -appTokens -password -__v');
        if (!carrier) {
            res.status(404).json({ msg: 'Carrier not found' });
            return;
        }
        res.status(200).json({ data: carrier });
    }
    catch (error) {
        console.error('Error fetching carrier by ID:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.getCarrierById = getCarrierById;
const updateCarrier = async (req, res) => {
    try {
        if (req.user?.role_code !== 'A') {
            res.status(403).json({ msg: 'You are unauthorized to perform this action' });
            return;
        }
        const { carrierId, email, mobileNumber, name, gender, profileImage, contactDetails, address, ndis, additionalDetails, documents, } = req.body;
        if (!carrierId) {
            res.status(400).json({ msg: 'carrierId is required' });
            return;
        }
        const existing = await models_1.Carrier.findOne({ carrierId });
        if (!existing) {
            res.status(404).json({ msg: 'Carrier not found' });
            return;
        }
        // ✅ Top-level fields
        if (name)
            existing.name = name;
        if (gender)
            existing.gender = gender;
        if (profileImage)
            existing.profileImage = profileImage;
        if (email)
            existing.email = email;
        if (mobileNumber)
            existing.mobileNumber = mobileNumber;
        // ✅ contactDetails (nested)
        if (contactDetails) {
            existing.contactDetails = {
                ...contactDetails,
            };
        }
        // ✅ address (nested)
        if (address) {
            existing.address = {
                ...address,
            };
        }
        // ✅ ndis (nested)
        if (ndis) {
            existing.ndis = {
                ...ndis,
            };
        }
        // ✅ additionalDetails (nested)
        if (additionalDetails) {
            existing.additionalDetails = {
                ...additionalDetails,
            };
        }
        // ✅ documents (nested)
        if (documents) {
            existing.documents = {
                ...documents,
            };
        }
        await existing.save();
        res.status(200).json({
            msg: 'Carrier updated successfully',
            carrierId: existing.carrierId,
        });
    }
    catch (err) {
        console.error('Error updating carrier:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.updateCarrier = updateCarrier;
const updateCarrierStatus = async (req, res) => {
    try {
        if (req.user?.role_code !== 'A') {
            res.status(403).json({ msg: 'You are unauthorized to perform this action' });
            return;
        }
        const { carrierId } = req.body;
        if (!carrierId) {
            res.status(400).json({ msg: 'carrierId is required' });
            return;
        }
        const existing = await models_1.Carrier.findById(carrierId);
        if (!existing) {
            res.status(404).json({ msg: 'Carrier not found' });
            return;
        }
        // Update fields if provided
        existing.status = !existing.status;
        await existing.save();
        res.status(200).json({
            msg: existing.status ? 'Carrier activated successfully' : 'Carrier inactivated successfully',
            carrierId: existing._id
        });
    }
    catch (err) {
        console.error('Error updating carrier:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.updateCarrierStatus = updateCarrierStatus;
const checkCarrierAvailability = async (req, res) => {
    try {
        const { startDate, endDate, startTime, endTime, repeatId, dayOfWeek, dayOfMonth, customSlotArray } = req.body;
        let filter = {};
        if (req.user?.role_code != 'A') {
            res.status(400).json({ msg: 'You are unauthorized to view this page' });
            return;
        }
        if (!startDate || !endDate || !startTime || !endTime || !repeatId) {
            res.status(400).json({ msg: 'Required fields are missing' });
            return;
        }
        // repeat Id check
        let isReapetCheck = await (0, slot_1.isReapetValid)(repeatId, dayOfWeek, dayOfMonth, customSlotArray);
        if (isReapetCheck.status == false) {
            res.status(400).json({ msg: isReapetCheck.message });
            return;
        }
        //getting slots 
        let recurringArray = await (0, slot_1.getSlotRecurring)(startDate, endDate, repeatId, dayOfWeek, dayOfMonth, customSlotArray);
        filter = {
            status: { $eq: true },
            startDate: { $in: recurringArray },
            $or: [
                {
                    startTime: {
                        $gte: startTime,
                        $lte: endTime,
                    },
                },
                {
                    endTime: {
                        $gte: startTime,
                        $lte: endTime,
                    },
                },
            ],
        };
        const carrierIds = await models_1.Slot.find(filter).select('carrierId');
        const checkCarrierIds = carrierIds.map(res => res.carrierId);
        // Get Carrier array excluding already used carrierIds
        const carrierArray = await models_1.Carrier.find({
            status: true,
            _id: { $nin: checkCarrierIds }
        }).select('_id name'); // or other fields you need
        res.status(200).json({
            msg: 'Slot list fetched successfully',
            data: carrierArray
        });
    }
    catch (err) {
        console.error('Error fetching slots:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.checkCarrierAvailability = checkCarrierAvailability;
