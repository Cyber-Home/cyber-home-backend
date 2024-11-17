import { registerUserValidator, loginUserValidator, updateProfileValidator } from "../validators/user.js";
import { UserModel } from "../models/user.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utils/emailService.js";


export const register = async (req, res) => {
    try {
        // validate user input
        const { error, value } = registerUserValidator.validate({firstName, lastName, email, homeAddress, workAddress, occupation, password, phone, uploadId: req.file?.filename, role});
        if (error) {
            return res.status(422).json(error);
        }
        // validating email
        const { firstName, lastName, email, homeAddress, workAddress, occupation, password, phone, uploadId } = req.body;

        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // saving user details    
        user = new UserModel({
            firstName,
            lastName,
            email,
            homeAddress,
            workAddress,
            occupation,
            password,
            phone,
            uploadId
        });

        await user.save();
        await sendWelcomeEmail(user.email, user.firstName);
        // generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: '24h'
        });
        // send response
        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                homeAddress: user.homeAddress,
                workAddress: user.workAddress,
                occupation: user.occupation,
                phone: user.phone,
                uploadId: user.uploadId,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}


export const login = async (req, res) => {
    try {
        // validate user input
        const { error, value } = loginUserValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }

        const { email, password } = req.body;
        // find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // generate token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_PRIVATE_KEY, {
            expiresIn: '24h'
        });
        // send response
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
}


export const getProfile = async (req, res, next) => {
    try {
        // find authenticated user from database
        const user = await UserModel.findById(req.auth.id).select({password: false});
        // respond to request
        res.json(user);
    } catch (error) {
        next(error);
    }
}


export const updateProfile = async (req, res) => {
    const { error, value } = updateProfileValidator.validate({
        ...req.body,
        avatar: req.file?.filename
    });
    if (error) {
        return res.status(422).json({ errors: error.details });
    }

    try {
        await UserModel.findByIdAndUpdate(req.user.id, value);
        res.json('Profile updated');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};