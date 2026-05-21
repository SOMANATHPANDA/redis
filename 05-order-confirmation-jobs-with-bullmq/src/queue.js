import { Queue } from "bullmq";

const connection = {
    host: "localhost",
    port: 6379
};

const orderQueue = new Queue("order-confirmation", { connection });

// Export queue and connection
export { orderQueue, connection };