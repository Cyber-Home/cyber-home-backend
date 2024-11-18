import { TaskModel } from "../models/task.js";
import { notifyAdminNewTask } from "../utils/emailService.js";
import { UserModel } from "../models/user.js";
import { addTaskValidator } from "../validators/task.js";



export const createTask = async (req, res) => {
    try {
        // validate user input
        const { error, value } = addTaskValidator.validate({...req.body, upload:req.file?.filename});
        if (error) {
            return res.status(422).json(error);
        }
        // Debug log to check auth object
        console.log('Auth object:', req.auth);

        // validating task details
        const { service, title, description, contactPerson, phone, upload, scheduledDate, location } = req.body;
        
        // adding user id to task created
        const userId = req.auth.userId;
        console.log('Converted userId:', userId);

        const user = await UserModel.findById(userId);
        console.log('Found user:', user);
        
        // checking if user is authenticated
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found",
                debugInfo: { 
                    searchedId: userId,
                    tokenInfo: req.auth 
                } 
            });
        }

        // creating task with auth.id
        const task = new TaskModel({
            user,
            service,
            title,
            description,
            contactPerson,
            phone,
            scheduledDate,
            location,
            upload:req.file?.filename
        });

        // Debug log to check task data
        console.log('Task data before save:', task);

        // Create and save task
        await task.save();

        // Notify admin about new task
        try {
            await notifyAdminNewTask(
                await task.populate('service'),
                user
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
        const tasks = await TaskModel.find({ user: req.auth.userId })
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
            user: req.auth.userId  
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
            user: req.auth.userId,  
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