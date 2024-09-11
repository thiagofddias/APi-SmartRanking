import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true },
    phoneNumber: { type: String },
    ranking: { type: String },
    position: { type: Number },
    urlPhotoPlayer: { type: String },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  { timestamps: true, collection: 'players' },
);
