import { model, Schema } from 'mongoose';

export const StatisticSchema = new Schema({
    name: String,
    food: {
        lahmacun: { type: Number, default: 0 },
        ayran: { type: Number, default: 0 },
        tatli: { type: Number, default: 0 },
        corba: { type: Number, default: 0 },
        AntepLahmacun: { type: Number, default: 0 },
        su: { type: Number, default: 0 },
        Cola: { type: Number, default: 0 },
        bahsis: { type: Number, default: 0 }
    }
});

export const StatisticModel = model('Statistic', StatisticSchema);
