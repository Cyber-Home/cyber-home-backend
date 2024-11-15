import { TaskModel } from "../models/task.js";
import { notifyAdminNewTask } from "../utils/emailService.js";
import { UserModel } from "../models/user.js";



export const createTask = async (req, res) => {
    try {
        // Debug log to check auth object
        console.log('Auth object:', req.auth);

        // Check if auth exists
        if (!req.auth || req.auth.id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // validating task details
        const { service, title, description, contactPerson, phone, upload, scheduledDate, location, priority } = req.body;
        
        // creating task with auth.id
        const task = new TaskModel({
            service,
            title,
            description,
            contactPerson,
            phone,
            scheduledDate,
            location,
            upload,
            priority
        });

        // Add optional fields if they exist
        if (upload) task.upload = upload;

        // Debug log to check task data
        console.log('Task data before save:', task);

        // Create and save task
        await task.save({
            user: req.auth.id
        });

        // Notify admin about new task
        try {
            await notifyAdminNewTask(
                await task.populate('service'),
                req.auth
            );
        } catch (emailError) {
            console.error('Failed to send admin notification:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating task',
            error: error.message 
        });
    }
}


export const getUserTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find({ user: req.auth.id })
            .populate('service')
            .populate('worker')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}


export const updateTask = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'scheduledDate', 'priority', 'status'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }

        const task = await TaskModel.findOne({ 
            _id: req.params.id, 
            user: req.auth.id  
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
}


export const deleteTask = async (req, res) => {
    try {
        const task = await TaskModel.findOneAndDelete({
            _id: req.params.id,
            user: req.auth.id,  
            status: 'pending'
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found or cannot be deleted' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
}