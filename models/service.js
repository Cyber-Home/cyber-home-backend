import { Schema, model } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


// creating service schema
const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        base: Number,
        unit: String
    },
    duration: {
        estimated: Number,
        unit: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// adding plugin to service schema
serviceSchema.plugin(toJSON);

// exporting service model
export const ServiceModel = model('Service', serviceSchema);