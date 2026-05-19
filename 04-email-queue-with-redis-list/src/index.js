import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new Redis( process.env.REDIS_URL || 'redis://localhost:6379' );

const QUEUE_KEY = "queue:emails"

// Endpoint to enqueue an email task
app.post('/email', async (req, res) => {
    const job ={
        to: req.body.to,
        subject: req.body.subject || "No Subject",
        body: req.body.body || "No Body",
        timestamp: new Date().toISOString()
    };
    await redis.lpush(QUEUE_KEY, JSON.stringify(job));
    res.json({ queued : true, job });
});

// Endpoint to process the next email task in the queue
app.get('/process-email', async (req, res) => {
    const jobData = await redis.rpop(QUEUE_KEY);
    if (!jobData) {
        return res.status(404).json({ error: 'No email tasks in the queue' });
    }
    const job = JSON.parse(jobData);
    res.json({ processed: true, job });
});

// Cons of using Redis queues are 
// 1.Job loss (due to server crashes or network issues)
// 2.Lack of visibility (no built-in monitoring or retry mechanisms)
// 3.Scalability issues (not designed for high throughput or large workloads)
// 4.parallel processing (difficult to process multiple jobs concurrently without additional coordination)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
