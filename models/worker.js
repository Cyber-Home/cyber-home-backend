import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


// creating worker schema 
const workerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    services: [{
        type: Types.ObjectId,
        ref: 'Service'
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'busy'],
        default: 'active'
    },
    rating: {
        type: Number,
        default: 0
    },
    completedTasks: {
        type: Number,
        default: 0
    },
    documents: [{
        type: String,
    }],
    availability: [{
        day: String,
        startTime: String,
        endTime: String
    }]
}, {
    timestamps: true
});

// adding plugin to worker schema
workerSchema.plugin(toJSON);

// exporting worker model
export const WorkerModel = model('Worker', workerSchema);