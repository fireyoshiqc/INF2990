/**
 * easyScore.model.ts - Database model for easy highscores.
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/08
 */

import * as mongoose from 'mongoose';

export interface IEasyScore extends mongoose.Document {
    name: string;
    time: number;
}

export const EASY_SCORE_SCHEMA = new mongoose.Schema(
    { name: { type: String, required: true }, time: { type: Number, required: true } },
    { collection: 'easyScores' });

const easyScore = mongoose.model<IEasyScore>('EasyScore', EASY_SCORE_SCHEMA);
export default easyScore;
