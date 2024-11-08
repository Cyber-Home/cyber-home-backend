import express from "express";
import mongoose from "mongoose";
import adminRouter from "./routes/admin.js";
import userRouter from "./routes/user.js";
import workerRouter from "./routes/worker.js";
import taskRouter from "./routes/task.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "mrogan";

// basic error handling
app.use((err, req, res, next) =>{
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// database connection
await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.error('could not connect to MongoDB:', err));

// middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// routes
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/worker', workerRouter);
app.use('/api/task', taskRouter);

// listen for incoming requests
const PORT = process.env.PORT || 3010;
app.listen(3010, () => {
    console.log(`App is listening on port ${PORT}`)
}); 