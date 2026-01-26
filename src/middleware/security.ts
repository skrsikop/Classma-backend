import { Request, Response, NextFunction } from "express";
import aj  from '../configs/arcjet' 
import { ArcjetNodeRequest, slidingWindow } from "@arcjet/node";

const securityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(process.env.NODE_ENV === 'test') return next();

    try {
        const role: RateLimitRole = req.user?.role ?? 'guest';

        let limit: number;
        let message: string;

        switch (role) {
            case 'admin':
                limit = 2;
                message = "Admin rate limit exceeded (20 per minute)";
                break;
            case 'teacher':
                // limit = 500;
                // message = "Teacher rate limit exceeded";
                break;
            case 'student':
                limit = 10;
                message = "user request limit exceeded (10 per minute)";
                break;
        
            default:
                limit = 5;
                message = "Guest request limit exceeded (5 per minute) please sign up for higher limit";
                break;
        }

        const client = aj.withRule(
            slidingWindow({
                mode: "LIVE",
                interval: '1m',
                max: limit,
            })
        )

        const arcjetRequest: ArcjetNodeRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: {remoteAddress: req.socket.remoteAddress ?? req.ip ?? '0.0.0.0'}
        }

        const decision = await client.protect(arcjetRequest);

        if(decision.isDenied() && decision.reason.isBot()) {
            return res.status(403).json({ error: 'Forbidden' , message: 'Automated Tasks not allowed' });
        }

        if(decision.isDenied() && decision.reason.isShield()) {
            return res.status(403).json({ error: 'Forbidden' , message: 'Request blocked by security policy' });
        }

        if(decision.isDenied() && decision.reason.isRateLimit()) {
            return res.status(403).json({ error: 'Too many requests' , message });
        }
    
        next()
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        return res.status(500).json({ error: 'internal error' , message: "something went wrong with arcjet security middleware" });
    }
}

export default securityMiddleware