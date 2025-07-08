"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientByClientId = exports.createClient = void 0;
const slot_controller_1 = require("../controllers/slot.controller");
const slot_1 = require("../services/slot");
const models_1 = require("../models");
const createClient = async (req, res) => {
    try {
        if (req.user?.role_code != 'A') {
            res.status(400).json({ msg: 'You are unauthorized to view this page' });
            return;
        }
        const { startDate, endDate, startTime, endTime, duration, documents, status, carrierId, repeatId, personalInfo, relationInfo, address, medicalInfo, ndis, dayOfWeek, dayOfMonth, customSlotArray } = req.body;
        // Check if email already exists
        const existing = await models_1.Client.findOne({ $or: [
                { 'personalInfo.email': personalInfo.email },
                { 'personalInfo.mobileNumber': personalInfo.mobileNumber }
            ] });
        if (existing) {
            res.status(400).json({ msg: 'Client already exists. Email or Mobile number already exist...' });
            return;
        }
        // date validation  check
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
        // const carrierRoleId = (await Role.findOne({ roleCode: 'C' }))?._id;
        // Hash the password
        // const hashedPassword = await bcrypt.hash(password || '123456', 10);
        // Get S3 file URL from multer-s3
        // const s3File = req.file as Express.Multer.File & { location?: string };
        //  let fileUrl:any = '';
        //     if (req.file) {
        //         fileUrl = await uploadToS3(req.file);
        //     }
        // const profileImageUrl = fileUrl;
        //   const profileImageUrl = req.file?.location || ''; // if no image, fallback to ''
        // Create client
        //create a random client ID
        let clientId = Math.floor(100000 + Math.random() * 900000).toString();
        while (true) {
            const existing = await models_1.Client.findOne({ clientId });
            if (existing) {
                clientId = Math.floor(100000 + Math.random() * 900000).toString();
            }
            else {
                break;
            }
        }
        //
        const newClient = new models_1.Client({
            clientId,
            startDate,
            endDate,
            startTime,
            endTime,
            duration,
            documents,
            status,
            carrierId,
            repeatId,
            createdBy: req.user.id,
            //object
            personalInfo,
            relationInfo,
            address,
            medicalInfo,
            ndis
        });
        await newClient.save();
        //create carrier in xero 
        // await createEmployeeInXeroAU(req, res, newCarrier);
        //
        req.body.clientId = newClient._id;
        await (0, slot_controller_1.createSlot)(req, res);
        res.status(201).json({
            msg: 'Client created successfully',
            clientId: clientId
        });
    }
    catch (err) {
        console.error('Error creating carrier:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.createClient = createClient;
const getClientByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;
        if (!clientId) {
            res.status(400).json({ msg: 'clientId is required' });
            return;
        }
        const client = await models_1.Client.findOne({ clientId })
            .select([
            'clientId',
            'scheduleVisitStartDateTime',
            'scheduleVisitEndDateTime',
            'duration',
            'documents',
            'status',
            'carrierId',
            'repeatId',
            'createdBy',
            'personalInfo',
            'relationInfo',
            'address',
            'medicalInfo',
            'createdAt',
            'updatedAt'
        ]);
        if (!client) {
            res.status(404).json({ msg: 'Client not found' });
            return;
        }
        res.status(200).json({
            msg: 'Client fetched successfully',
            data: client,
        });
    }
    catch (err) {
        console.error('Error fetching client:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
exports.getClientByClientId = getClientByClientId;
