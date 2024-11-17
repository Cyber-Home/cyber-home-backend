import { UserModel } from "../models/user.js";
import { TaskModel } from "../models/task.js";
import { WorkerModel } from "../models/worker.js";
import { ServiceModel } from "../models/service.js";
import { sendTaskAssignedEmail } from "../utils/emailService.js";
import { addServiceValidator, addWorkerValidator } from "../validators/admin.js";


// Worker Management
export const addWorker = async (req, res) => {
    try {
        // validate user input
        const { error, value } = addWorkerValidator.validate({...req.body, document:req.file?.filename});
        if (error) {
            return res.status(422).json(error);
        }

        const { firstName, lastName, email, phone, services, availability, document } = req.body;
        // checking if worker already exists
        const workerExists = await WorkerModel.findOne({ email });
        if (workerExists) {
            return res.status(400).json({ message: 'Worker already exists' });
        }
        // creating worker
        const worker = new WorkerModel({
            firstName,
            lastName,
            email,
            phone,
            services,
            availability,
            document:req.file?.filename
        });

        await worker.save();
        res.status(201).json(worker);
    } catch (error) {
        res.status(500).json({ message: 'Error adding worker' });
    }
}


export const deleteWorker = async (req, res) => {
    try {
        const workerId = req.params.id;

        // Check if worker has any assigned tasks
        const hasActiveTasks = await TaskModel.exists({
            worker: workerId,
            status: { $in: ['assigned', 'in-progress'] }
        });
        // cheking if worker has active tasks
        if (hasActiveTasks) {
            return res.status(400).json({
                message: 'Cannot delete worker with active tasks. Reassign or complete tasks first.'
            });
        }
        // deleting worker
        const worker = await WorkerModel.findByIdAndDelete(workerId);

        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        res.json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting worker' });
    }
}


// Service Management
export const addService = async (req, res) => {
    try {
        // validate user input
        const { error, value } = addServiceValidator.validate(req.body);
        if (error) {
            return res.status(422).json(error);
        }
        
        const { name, description, category, price, duration } = req.body;
        // checking if service already exists
        const serviceExists = await ServiceModel.findOne({ name });
        if (serviceExists) {
            return res.status(400).json({ message: 'Service already exists' });
        }
        // creating service
        const service = new ServiceModel({
            name,
            description,
            category,
            price,
            duration
        });

        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error adding service' });
    }
}


export const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;

        // Check if service is associated with any active tasks
        const hasActiveTasks = await TaskModel.exists({
            service: serviceId,
            status: { $in: ['pending', 'assigned', 'in-progress'] }
        });

        if (hasActiveTasks) {
            return res.status(400).json({
                message: 'Cannot delete service with active tasks. Complete tasks first.'
            });
        }

        // Check if service is associated with any workers
        const hasWorkers = await WorkerModel.exists({
            services: serviceId
        });

        if (hasWorkers) {
            return res.status(400).json({
                message: 'Cannot delete service assigned to workers. Remove service from workers first.'
            });
        }
        // deleting service
        const service = await ServiceModel.findByIdAndDelete(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting service' });
    }
}


// Task Management
export const getAllTasks = async (req, res) => {
    try {
        const { status, date } = req.query;
        let query = {};
        // filtering tasks by status and date
        if (status) query.status = status;
        if (date) {
            query.scheduledDate = {
                $gte: new Date(date),
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
            };
        }
        // finding tasks
        const tasks = await TaskModel.find(query)
            .populate('user', 'firstName lastName email')
            .populate('worker', 'firstName lastName')
            .populate('service', 'name')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
}


export const assignTask = async (req, res) => {
    try {
        const { taskId, workerId } = req.body;
        // finding task and worker
        const task = await TaskModel.findById(taskId);
        const worker = await WorkerModel.findById(workerId);

        if (!task || !worker) {
            return res.status(404).json({ message: 'Task or Worker not found' });
        }

        task.worker = workerId;
        task.status = 'assigned';
        await task.save();

        // Notify user and worker
        const user = await UserModel.findById(task.user);
        await sendTaskAssignedEmail(user.email, task, worker);

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning task' });
    }
}

export const getDashboardStats = async (req, res) => {
    try {
        // getting stats
        const stats = {
            totalTasks: await TaskModel.countDocuments(),
            pendingTasks: await TaskModel.countDocuments({ status: 'pending' }),
            completedTasks: await TaskModel.countDocuments({ status: 'completed' }),
            totalWorkers: await WorkerModel.countDocuments(),
            activeWorkers: await WorkerModel.countDocuments({ status: 'active' }),
            totalUsers: await UserModel.countDocuments({ role: 'user' })
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
}