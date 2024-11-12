import { UserModel } from "../models/user.js";

export const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.auth.id);
        const permission = value => value.role === user.role;
        // Check if user exists and has admin role
        if (!permission == 'admin') {
            return res.status(200).json({ 
                success: false, 
                message: 'You are not an admin'
            });
        }
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error in admin authorization' 
        });
    }
};