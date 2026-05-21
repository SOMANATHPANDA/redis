import { Worker } from "bullmq";
import { connection } from "./queue.js";

// Create a worker to process jobs from the "order-confirmation" queue
const orderWorker = new Worker(
    "order-confirmation",
    async (job) => {
        // Process the job
        console.log("Processing job:",job.id, job.data);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Job completed:", job.id);
    },

    { connection }
);

orderWorker.on("completed", (job) => {
    console.log(`Job ${job.id} has been completed!`);
});

orderWorker.on("failed", (job, err) => {
    console.error(`Job ${job.id} has failed with error:`, err);
});