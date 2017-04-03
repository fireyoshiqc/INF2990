/**
 * hardScore.model.ts - Database model for hard highscores.
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import * as mongoose from 'mongoose';

export interface IHardScore extends mongoose.Document {
    name: string;
    playerScore: number;
    aiScore: number;
}

export const HARD_SCORE_SCHEMA = new mongoose.Schema(
    { name: { type: String, required: true },
      playerScore: { type: Number, required: true },
      aiScore: { type: Number, required: true } },
    { collection: 'hardScores', timestamps: {} });

const hardScore = mongoose.model<IHardScore>('HardScore', HARD_SCORE_SCHEMA);
export default hardScore;
