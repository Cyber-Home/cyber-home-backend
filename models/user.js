import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { toJSON } from "@reis/mongoose-to-json";


// creating user schema
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    homeAddress: {
        type: String,
        required: true,
    },
    workAddress: {
        type: String,
        required: true,
    },
    occupation: {
        type: String,
        required: true,
    },
    uploadId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// adding plugin to user schema
userSchema.plugin(toJSON);

// exporting user model
export const UserModel = model('User', userSchema);