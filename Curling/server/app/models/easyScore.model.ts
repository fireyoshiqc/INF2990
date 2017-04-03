/**
 * easyScore.model.ts - Database model for easy highscores.
 *
 * @authors Yawen Hou, Pierre To
 * @date 2017/04/02
 */

import * as mongoose from 'mongoose';

export interface IEasyScore extends mongoose.Document {
    name: string;
    playerScore: number;
    aiScore: number;
}

export const EASY_SCORE_SCHEMA = new mongoose.Schema(
    { name: { type: String, required: true },
      playerScore: { type: Number, required: true },
      aiScore: { type: Number, required: true } },
    { collection: 'easyScores', timestamps: {} });

const easyScore = mongoose.model<IEasyScore>('EasyScore', EASY_SCORE_SCHEMA);
export default easyScore;
