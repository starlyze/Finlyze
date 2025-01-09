import { Listing } from '../models/listing.model';

export const searchStocks = async (req: any, res:any) => {
    const ticker = req.query.symbol;
    try {
      const listings = await Listing.aggregate([
        {
          $match: {
            symbol: { $regex: `^${ticker}`, $options: 'i' }
          }
        },
        {
          $limit: 10
        }
      ]);
      res.status(200).json(listings);
    }
    catch (error){
      res.status(500).json({success:false, message:"Server error"});
    }
  }
