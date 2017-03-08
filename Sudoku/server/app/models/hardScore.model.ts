/**
 * hardScore.model.ts - Database model for hard highscores.
 *
 * @authors Félix Boulet, Erica Bugden
 * @date 2017/03/08
 */

import * as mongoose from 'mongoose';

export interface IHardScore extends mongoose.Document {
    name: string;
    time: number;
}

export const HARD_SCORE_SCHEMA = new mongoose.Schema(
    { name: { type: String, required: true }, time: { type: Number, required: true } },
    { collection: 'hardScores' });

const hardScore = mongoose.model<IHardScore>('HardScore', HARD_SCORE_SCHEMA);
export default hardScore;
