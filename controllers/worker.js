import { TaskModel } from "../models/task.js";
import { sendTaskStatusUpdate } from "../utils/emailService.js";


export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId, status } = req.body;
// finding task
        const task = await TaskModel.findOne({
            _id: taskId,
            worker: worker._id
        }).populate('user');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
// updating task status
        task.status = status;
        if (status === 'completed') {
            task.completedAt = new Date();
            worker.completedTasks += 1;
            await worker.save();
        }

        await task.save();
        await sendTaskStatusUpdate(task.user.email, task);

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task status' });
    }
}


export const getAssignedTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find({
            worker: worker._id,
            status: { $in: ['assigned', 'in-progress'] }
        })
        .populate('user', 'firstName lastName phone')
        .populate('service')
        .sort({ scheduledDate: 1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned tasks' });
    }
}


export const updateAvailability = async (req, res) => {
    try {
        // worker availability
        const { availability } = req.body;
        const worker = worker._id;
// updating worker availability
        worker.availability = availability;
        await worker.save();

        res.json(worker);
    } catch (error) {
        res.status(500).json({ message: 'Error updating availability' });
    }
}