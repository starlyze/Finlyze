import { Listing } from '../models/listing.model';
import Alpaca from '@alpacahq/alpaca-trade-api';
import {alpacaApiKey, alpacaSecretKey} from "../config/secrets";
import {User} from "../models/user.model";

export const searchStocks = async (req: any, res:any) => {
  const ticker = req.query.symbol;
  try {
    const listings = await Listing.aggregate([
      {
        $search: {
          index: 'listing',
          text: {
            query: ticker,
            path: {
              wildcard: "*"
            }
          }
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

export const getStockData = async (req: any, res:any) => {
  const tickerID = req.query.id;
  const userID = req.query.user;
  const interval = req.query.interval;
  try {
    if (!tickerID || !userID || !interval) {
      res.status(401).json({success: false, message: "Invalid request"});
      return;
    }
    const user = await User.findById(userID);
    if (!user) {
      res.status(401).json({success: false, message: "User not found"});
      return;
    }
    const listing = await Listing.findById(tickerID);
    if (!listing) {
      res.status(404).json({success: false, message: "Stock not found"});
      return;
    }
    const alpaca = new Alpaca({
      keyId: alpacaApiKey,
      secretKey: alpacaSecretKey,
    });
    const intervals = [
      {days: 0, timeframe: alpaca.newTimeframe(5, alpaca.timeframeUnit.MIN)},
      {days: 6, timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.HOUR)},
      {days: 29, timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY)},
      {days: 89, timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY)},
      {days: 364, timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.WEEK)},
      {days: 1824, timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.WEEK)},
    ];

    const lastBar = await alpaca.getLatestBar(listing.symbol);
    const end = new Date(new Date(lastBar.Timestamp).getTime() - 1000 * 60 * 15);
    const start = new Date(new Date(end.toISOString().split('T')[0] + 'T14:30:00Z').getTime() - intervals[interval].days*1000*60*60*24);
    if (end.getTime() - start.getTime() < 1000*60*30) {
      res.status(200).json({metaData: listing, lastBar: lastBar, data: []});
    }
    const bars = alpaca.getBarsV2(listing.symbol, {
      start: start.toISOString(),
      end: end.toISOString(),
      timeframe: intervals[interval].timeframe,
      adjustment: 'split'
    });
    // console.log(lastBar);
    const got = [];
    for await (let bar of bars) {
      if (!bar) continue;
      got.push([new Date(bar.Timestamp).getTime(), bar.ClosePrice]);
    }
    got.push([new Date(lastBar.Timestamp).getTime(), lastBar.ClosePrice]);
    res.status(200).json({metaData: listing, lastBar: lastBar, data: got});
  } catch (error: any) {
    console.log(error);
    res.status(500).json({success:false, message: error});
  }
}
