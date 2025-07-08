import { Request, Response } from "express";
import { createSlot } from '../controllers/slot.controller';
import { isReapetValid } from '../services/slot';
import { Client } from '../models';

export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {



        if ((req as any).user?.role_code != 'A') {
            res.status(400).json({ msg: 'You are unauthorized to view this page' });
            return;
        }

           const {
           startDate,
           endDate,
           startTime,
           endTime,
           duration,
           documents,
           status,
           carrierId,
           repeatId,
           personalInfo,
           relationInfo,
           address,
           medicalInfo,
           ndis,
           dayOfWeek,
           dayOfMonth,
           customSlotArray
        } = req.body;

           

      

        // Check if email already exists
        
        const existing = await Client.findOne({ $or: [
            { 'personalInfo.email': personalInfo.email },
            { 'personalInfo.mobileNumber': personalInfo.mobileNumber }
        ]});
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
        let isReapetCheck = await isReapetValid(repeatId,  dayOfWeek, dayOfMonth, customSlotArray)
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
        while(true){
             const existing = await Client.findOne({ clientId });
            if (existing) {
                clientId = Math.floor(100000 + Math.random() * 900000).toString();

            }else{
                break;
            }
        }

        //
       


        const newClient = new Client({
            clientId,
            startDate,
            endDate,
            startTime,
            endTime,
            duration ,
            documents ,
            status,
            carrierId,
            repeatId,
            createdBy : (req as any).user.id,
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
        await createSlot(req, res);

        res.status(201).json({
            msg: 'Client created successfully',
            clientId: clientId
        });
    } catch (err: any) {
        console.error('Error creating carrier:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const getClientByClientId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      res.status(400).json({ msg: 'clientId is required' });
      return;
    }

    const client = await Client.findOne({ clientId })
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
  } catch (err: any) {
    console.error('Error fetching client:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};


