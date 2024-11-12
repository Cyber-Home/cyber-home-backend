import { createTransport } from "nodemailer";


const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    from: process.env.EMAIL_FROM
});


export const sendWelcomeEmail = async (email, name) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to DailySpot',
            html: `
                    <h1>Welcome to DailySpot, ${name}!</h1>
                    <p>Thank you for joining our platform. We're excited to help you manage your daily tasks.</p>
                    <p>Get started by creating your first task!</p>
                `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
}


export const notifyAdminNewTask = async (task, user) => {
    try {
        // Get admin emails
        const adminEmails = process.env.ADMIN_EMAILS.split(',');

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: adminEmails,
            subject: 'New Task Created - Action Required',
            html: `
                <h2>New Task Requires Review</h2>
                <h3>Task Details:</h3>
                <ul>
                    <li><strong>User:</strong> ${user.firstName} ${user.lastName} (${user.email})</li>
                    <li><strong>Description:</strong> ${task.description}</li>
                    <li><strong>Scheduled Date:</strong> ${new Date(task.scheduledDate).toLocaleString()}</li>
                    <li><strong>Priority:</strong> ${task.priority}</li>
                    <li><strong>Location:</strong> ${task.location.address}</li>
                </ul>
                <p>Please review and assign this task to an available worker.</p>
                <p>Access the admin dashboard to manage this task.</p>
            `
        });
    } catch (error) {
        console.error('Admin notification email failed:', error);
    }
}


export const sendTaskAssignedEmail = async (email, task, worker) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Task Assigned - DailySpot',
            html: `
                    <h2>Your task has been assigned!</h2>
                    <p>Task: ${task.description}</p>
                    <p>Worker: ${worker.firstName} ${worker.lastName}</p>
                    <p>Scheduled Date: ${new Date(task.scheduledDate).toLocaleDateString()}</p>
                    <p>Status: ${task.status}</p>
                `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
}


export const sendTaskStatusUpdate = async (email, task) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Task Status Update - ${task.status.toUpperCase()}`,
            html: `
                    <h2>Your task status has been updated</h2>
                    <p>Task: ${task.description}</p>
                    <p>New Status: ${task.status}</p>
                    <p>Updated at: ${new Date().toLocaleString()}</p>
                `
        });
    } catch (error) {
        console.error('Email sending failed:', error);
    }
}