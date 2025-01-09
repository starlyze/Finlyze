import { Data, Item } from '../models/userData.model';

export const addUser = async (req: any, res:any) => {
  const {username} = req.body;
  try {
    const existingUser = await Data.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newUser = new Data(req.body);
    newUser.save();
    res.status(200).json({success:true, message:"Successfully saved new user"});
  }
  catch (error){
    res.status(500).json({success:false, message:"Server error"});
  }
}

export const addIncome = async (req: any, res: any) => {
    const {userId} = req.params;
    const newData = new Item(req.body);
    try {
      const result = await Data.findByIdAndUpdate(
        userId,
        { $push: { income: newData } },
        { new: true }
      );
        res.status(200).json({success:true, message:"Successfully saved"});
    } catch (error) {
      res.status(500).json({success:false, message:"Server error"});
    }
  };
export const removeIncome = async (req: any, res: any) => {
    const { userId, incomeId} = req.params;
    try {
        const result = await Data.findByIdAndUpdate(
            userId, 
            { $pull: { income: { _id: incomeId } } },
            { new: true }
          );
        res.status(200).json({success:true, message:"Removed income record"});
    } catch (error) {
        res.status(500).json({success:false, message:"Server error"});
    }
  };
export const addExpense = async (req: any, res: any) => {
  const {userId} = req.params;
  const { item } = req.body;
  const newData = new Item(item);
  try {
    const result = await Data.findByIdAndUpdate(
      userId,
      { $push: { expense: newData } },
      { new: true }
    );
      res.status(200).json({success:true, message:"Successfully saved"});
  } catch (error) {
    res.status(500).json({success:false, message:"Server error"});
  }
  };
export const removeExpense = async (req: any, res: any) => {
  const { userId, incomeId} = req.params;
  try {
      const result = await Data.findByIdAndUpdate(
          userId, 
          { $pull: { expense: { _id: incomeId } } },
          { new: true }
        );
      res.status(200).json({success:true, message:"Removed expense record"});
  } catch (error) {
      res.status(500).json({success:false, message:"Server error"});
  }
  };