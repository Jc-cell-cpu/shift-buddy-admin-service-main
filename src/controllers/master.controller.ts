import { Request, Response } from "express";
import { SlotMode, Weekday , Ndis} from '../models';


export const getWeekdays = async (req: Request, res: Response): Promise<void> => {
  try {


    const weekdays = await Weekday.find();

   

    res.status(200).json({
      msg: 'Weekdays fetched successfully',
      data: weekdays,
    });
  } catch (err: any) {
    console.error('Error fetching weekdays:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getRepeatMode = async (req: Request, res: Response): Promise<void> => {
  try {


    const repeatModes = await SlotMode.find();

   

    res.status(200).json({
      msg: 'Repeat fetched successfully',
      data: repeatModes,
    });
  } catch (err: any) {
    console.error('Error fetching weekdays:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export const getNdis = async (req: Request, res: Response): Promise<void> => {
  try {


    const repeatModes = await Ndis.find();

   

    res.status(200).json({
      msg: 'Repeat fetched successfully',
      data: repeatModes,
    });
  } catch (err: any) {
    console.error('Error fetching weekdays:', err.message);
    res.status(500).json({ msg: 'Internal server error' });
  }
};



