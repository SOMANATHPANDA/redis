import express from "express";
import {orderQueue} from "./queue.js";


const app = express();
app.use(express.json());

app.post("/orders", async (req, res) => {
    const { orderId, customerId } = req.body;
    console.log("Received order:", orderId, customerId);

    try {
        await orderQueue.add("order-confirmed", { orderId, customerId },
            { attempts: 3, 
                backoff: {
                type: "exponential",
                delay: 5000
                }
            }
        );
        res.status(202).json({ message: "Order confirmation job added to queue" });
    } catch (error) {
        console.error("Error adding job to queue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});