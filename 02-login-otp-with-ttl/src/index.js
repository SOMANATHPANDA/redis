import express from "express";
import Redis from "ioredis";

const app = express();
app.use( express.json() );

const redis = new Redis( "redis://localhost:6379" );

function otpkey( phone ) {
    return `otp:${phone}`;
}

function generateOTP() {
    return Math.floor( 100000 + Math.random() * 900000 ).toString();
}

app.post( "/send-otp", async ( req, res ) => {
    const { phone } = req.body;
    const otp = generateOTP();
    const key = otpkey( phone );

    await redis.setex( key, 60, otp ); // Store OTP with 60-second TTL
    // In a real application, you would send the OTP via SMS or email here

    res.json( { message: "OTP sent successfully", otp } );
} );

app.post( "/verify-otp", async ( req, res ) => {
    const { phone, otp } = req.body;
    const key = otpkey( phone );
    const storedOtp = await redis.get( key );

    if ( !storedOtp ) {
        return res.status( 400 ).json( { error: "Invalid or expired OTP" } );
    }

    if ( storedOtp !== otp ) {
        return res.status( 400 ).json( { error: "Invalid OTP" } );
    }

    await redis.del( key ); // Remove the used OTP
    res.json( { message: "OTP verified successfully" } );
} );

app.get("/otp/:phone/ttl", async (req, res) => {
    const { phone } = req.params;
    const key = otpkey( phone );
    const ttl = await redis.ttl( key );

    if ( ttl === -1 ) {
        return res.status( 404 ).json( { error: "OTP not found" } );
    }

    res.json( { ttl } );
} );

app.listen( 3000, () => {
    console.log( "Server is running on http://localhost:3000" );
} );