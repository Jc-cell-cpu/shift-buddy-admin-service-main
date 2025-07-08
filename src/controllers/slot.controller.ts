import { Request, Response } from "express";
import moment from "moment";
import { Carrier, Client, Slot } from '../models';
import { getSlotRecurring, isReapetValid } from '../services/slot';

export const createSlot = async (req: Request, res: Response): Promise<void> => {
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
           clientId,
           repeatId,
           personalInfo,
           relationInfo,
           address,
           medicalInfo,
           ndis,
           dayOfWeek,
           dayOfMonth,
           customSlotArray
        }  = req.body;


        // let fileUrl:any = '';
        //     if (req.file) {
        //         fileUrl = await uploadToS3(req.file);
        //     }
        // const profileImageUrl = fileUrl;
 

        //create a random recurringId
        let recurringId = Math.floor(100000 + Math.random() * 900000).toString();
            while(true){
                const existing = await Slot.findOne({ recurringId });
                if (existing) {
                    recurringId = Math.floor(100000 + Math.random() * 900000).toString();

                }else{
                    break;
                }
            }


        //create slots 

        

        let recurringArray = await getSlotRecurring(startDate, endDate, repeatId,
            dayOfWeek, dayOfMonth, customSlotArray);
        
        
        // According to recurringArray creating slot using the loop
      const slotDocuments = recurringArray.map((date: Date | string) => ({
            recurringId,
            startDate:  date,
            endDate:  date,
            startTime,
            endTime,
            duration,
            documents,
            status,
            carrierId,
            clientId,
            repeatId,
            createdBy: (req as any).user.id,
            personalInfo,
            relationInfo,
            address,
            medicalInfo,
            ndis
         }));

        await Slot.insertMany(slotDocuments);

        return;

        // res.status(201).json({
        //     msg: 'Slots created successfully',
        //     recurringId: recurringId  
        // });
    } catch (err: any) {
        //Deleting the client
        await Client.deleteOne({ _id: req.body.clientId });
        console.error('Error creating carrier:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const getSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const {startDate, endDate } = req.body;

    const filter: any = {};

  

    // Optional: filter between date range
    if (startDate && endDate) {
      filter.startDate = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate(),
      };
    }

    if((req as any).user?.role_code != 'A'){
        filter.carrierId = (req as any).user?.id;
    }

    const slots = await Slot.find(filter).sort({ startDate: 1 });

    res.status(200).json({
      msg: 'Slot list fetched successfully',
      count: slots.length,
      data: slots
    });
  } catch (err: any) {
    console.error('Error fetching slots:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};






// export const updateSlot = async (req: Request, res: Response): Promise<void> => {
//     try {



//         if ((req as any).user?.role_code != 'A') {
//             res.status(400).json({ msg: 'You are unauthorized to view this page' });
//             return;
//         }

//            const {
         
//            scheduleVisitStartDateTime,
//            scheduleVisitEndDateTime,
//            duration,
//            documents,
//            status,
//            carrierId,
//            repeatId,
//            personalInfo,
//            relationInfo,
//            address,
//            medicalInfo,
//            customSlotArray,
//            dayOfWeek,
//            dayOfMonth
//         } = req.body;


//         // let fileUrl:any = '';
//         //     if (req.file) {
//         //         fileUrl = await uploadToS3(req.file);
//         //     }
//         // const profileImageUrl = fileUrl;
 

//         //create a random recurringId
    


//         //create slots 

//         let startDate = moment(scheduleVisitStartDateTime).format('YYYY-MM-DD');
//         let endDate = moment(scheduleVisitEndDateTime).format('YYYY-MM-DD');
//         let startTime = moment(scheduleVisitStartDateTime).format('HH:mm:ss');
//         let endTime = moment(scheduleVisitEndDateTime).format('HH:mm:ss');


//         let recurringArray = await getSlotRecurring(startDate, endDate, repeatId,
//             dayOfWeek, dayOfMonth, customSlotArray);
        
        
//         // According to recurringArray creating slot using the loop
//       const slotDocuments = recurringArray.map((date: Date | string) => ({
//             recurringId,
//             scheduleVisitStartDateTime:  moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm:ss').toISOString(),
//             scheduleVisitEndDateTime:  moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm:ss').toISOString(),
//             duration,
//             documents,
//             status,
//             carrierId,
//             repeatId,
//             createdBy: (req as any).user.id,
//             personalInfo,
//             relationInfo,
//             address,
//             medicalInfo
//          }));

//         await Slot.insertMany(slotDocuments);

//         return;

//         // res.status(201).json({
//         //     msg: 'Slots created successfully',
//         //     recurringId: recurringId  
//         // });
//     } catch (err: any) {
//         //Deleting the client
//         await Client.deleteOne({ _id: req.body.clientId });
//         console.error('Error creating carrier:', err.message);
//         res.status(500).json({ msg: 'Internal server error' });
//     }
// };


