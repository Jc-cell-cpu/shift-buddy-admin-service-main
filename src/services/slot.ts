import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
import moment from 'moment';
import { TokenSet } from 'xero-node';
import { Slot, SlotMode } from '../models'; // 👈 update path if needed


dotenv.config();

export const isReapetValid = async (repeatId:any, dayOfWeek:any, dayOfMonth:any, customSlotArray:any): Promise<{ status: boolean; message: string }> => {
  // Get the latest token
  const slotRecord = await SlotMode.findOne({_id:repeatId})
    if (!slotRecord) {
    throw new Error('Invaild Repeat Mode');
  }

 // checking the repeat condition here
    let result:any =[];
    if(slotRecord.repeatType == 'Weekly on the Day'){
        if (!dayOfWeek) {
                return {status : false , message  :'dayOfWeek is required'};
        }
    }
    else if(slotRecord.repeatType == 'Monthly on the Day'){
        if (!dayOfMonth) {  
                return {status : false , message  :'dayOfMonth is required'};
        }

    }
    else if(slotRecord.repeatType == 'Custom'){
          if (customSlotArray.length == 0) {  
                return {status : false , message  :'customSlotArray is required'};
        }
    }
   


    return {status : true , message  :''};
};



export const getSlotRecurring = async (startDate:any, endDate:any, repeatId:any, dayOfWeek:any, dayOfMonth:any, customSlotArray:any): Promise<string[]> => {
  // Get the latest token
  const slotRecord = await SlotMode.findOne({_id:repeatId})
    if (!slotRecord) {
    throw new Error('Invaild Repeat Mode');
  }

 // checking the repeat condition here
    let result:any =[];
    if(slotRecord.repeatType == 'Weekly on the Day'){
        // if (!dayOfWeek) {
        //         return {status : false , message  :'dayOfWeek is required'};
        // }
        result = await getDatesByWeekdayBetweenRange(startDate, endDate, dayOfWeek);
    }
    else if(slotRecord.repeatType == 'Monthly on the Day'){
        // if (!dayOfMonth) {  
        //         throw new Error('dayOfMonth is required');
        // }
        result = await getMonthlyDatesBetween(startDate, endDate, dayOfMonth);

    }
    else if(slotRecord.repeatType == 'Every weekday(Monday to Friday)'){
        result = await getWeekdaysBetween(startDate, endDate);
    }
    else if(slotRecord.repeatType == 'Custom'){
        result = customSlotArray;
    }
    else{
        result = [startDate]
    }


    return result;
};


//In case of weekdays

export const getDatesByWeekdayBetweenRange = (
  startDate: string,
  endDate: string,
  targetWeekday: number // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
): string[] => {
  const result: string[] = [];

  let current = moment(startDate);
  const end = moment(endDate);

  // Start from the first occurrence of the target weekday
  while (current.day() !== targetWeekday) {
    current.add(1, 'day');
  }

  // Add all matching weekdays until the end date
  while (current.isSameOrBefore(end, 'day')) {
    result.push(current.format('YYYY-MM-DD'));
    current.add(7, 'days'); // jump to next week
  }

  return result;
}


//In case of monthly
export const getMonthlyDatesBetween = (
  startDate: string,
  endDate: string,
  dayOfMonth: number
): string[] =>{
  const dates: string[] = [];
  const start = moment(startDate).startOf('month');
  const end = moment(endDate).endOf('month');

  let current = start.clone();

  while (current.isSameOrBefore(end)) {
    const targetDate = current.clone().date(dayOfMonth);

    if (
      targetDate.isSameOrAfter(startDate, 'day') &&
      targetDate.isSameOrBefore(endDate, 'day') &&
      targetDate.date() === dayOfMonth // only push valid dates
    ) {
      dates.push(targetDate.format('YYYY-MM-DD'));
    }

    current.add(1, 'month');
  }

  return dates;
}

//Every weekday(Monday to Friday)
export const getWeekdaysBetween = (startDateStr: string, endDateStr: string): string[] => {
  const startDate = moment(startDateStr);
  const endDate = moment(endDateStr);
  const weekdays: string[] = [];

  while (startDate.isSameOrBefore(endDate)) {
    const day = startDate.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    if (day >= 1 && day <= 5) {
      weekdays.push(startDate.format('YYYY-MM-DD'));
    }
    startDate.add(1, 'day');
  }

  return weekdays;
};




