import { TaskModel } from "../models/task.js";
import { notifyAdminNewTask } from "../utils/emailService.js";



export const createTask = async (req, res) => {
    try {
        // validating task details
        const { service, title, description, contactPerson, phone, upload, scheduledDate, location, priority } = req.body;
        // creating task
        const task = new TaskModel({
            user: req.auth.id,
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

        await task.save();

        // Notify admin about new task
        await notifyAdminNewTask(
            await TaskModel.populate('service'),
            req.user
        );

        res.status(201).json(task);
    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
}


export const getUserTasks = async (req, res) => {
    try {
        // finding tasks for user
        const tasks = await TaskModel.find({ user: req.user._id })
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
        // validating updates
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'scheduledDate', 'priority', 'status'];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        // if valid updates
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates' });
        }
        // finding task
        const task = await TaskModel.findOne({ _id: req.params.id, user: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        // updating task
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
}


export const deleteTask = async (req, res) => {
    try {
        // finding task
        const task = await TaskModel.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
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
