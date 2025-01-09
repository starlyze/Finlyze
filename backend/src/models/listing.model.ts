import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  symbol: { type: String },
  name: { type: String },
  exchange: { type: String },
  assetType: { type: Boolean},
  ipoDate: { type: String },
  delistingDate: {type: String },
  status: {type: String },
});

export const Listing = mongoose.model('listing', listingSchema);