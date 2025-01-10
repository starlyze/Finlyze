import { User, Transaction } from '../models/user.model';

export const addIncome = async (req: any, res: any) => {
    const userId = req.body.userId;
    const newData = new Transaction({
      date: req.body.date,
      amount: req.body.amount,
      name: req.body.name
    });
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $push: { income: newData } },
        { new: true }
      );
        res.status(200).json({success:true, message:"Successfully saved"});
    } catch (error) {
      res.status(500).json({success:false, message:"Server error"});
    }
  };

export const addExpense = async (req: any, res: any) => {
  const userId = req.body.userId;
  const newData = new Transaction({
    date: req.body.date,
    amount: req.body.amount,
    name: req.body.name
  });
  try {
    const result = await User.findByIdAndUpdate(
      userId,
      { $push: { expenses: newData } },
      { new: true }
    );
      res.status(200).json({success:true, message:"Successfully saved"});
  } catch (error) {
    res.status(500).json({success:false, message:"Server error"});
  }
  };
  export const removeIncome = async (req: any, res: any) => {
    const transactionId = req.body.transactionId;
    const userId = req.body.userId;
    try {
        const result = await User.findByIdAndUpdate(
            userId, 
            { $pull: { income: { _id: transactionId } } },
            { new: true }
          );
        res.status(200).json({success:true, message:"Removed income record"});
    } catch (error) {
        res.status(500).json({success:false, message:"Server error"});
    }
  };
export const removeExpense = async (req: any, res: any) => {
  const transactionId = req.body.transactionId;
  const userId = req.body.userId;
  try {
      const result = await User.findByIdAndUpdate(
          userId, 
          { $pull: { expenses: { _id: transactionId } } },
          { new: true }
        );
      res.status(200).json({success:true, message:"Removed expense record"});
  } catch (error) {
      res.status(500).json({success:false, message:"Server error"});
  } 
  };
export const getTransactions = async (req: any, res: any) => {
  const userId = req.body.userId;
  try {
    const result = await User.findById(userId);
    if(result){
      res.status(200).json(result.expenses.concat(result.income).sort(
        (a,b) => b.date.getTime() - a.date.getTime()));
    }
  } catch (error) {
    res.status(500).json({message: "Server error"});
  }
}