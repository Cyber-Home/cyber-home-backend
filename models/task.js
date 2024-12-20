import { Schema, model, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";


// creating task schema
const taskSchema = new Schema({
    user:{
        type: Types.ObjectId,
        ref: 'User'
    },
    service: {
        type: Types.ObjectId,
        ref: 'Service',
        required: true
    },
    worker: {
        type: Types.ObjectId,
        ref: 'Worker',
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    upload: {
        type: String,
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    notes: String
}, {
    timestamps: true
});

// adding plugin to user schema
taskSchema.plugin(toJSON);

// exporting user model
export const TaskModel = model('Task', taskSchema);