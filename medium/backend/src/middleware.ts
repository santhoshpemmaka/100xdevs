import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export const middleware =  async (c:any, next:any) => {
    try {
        const token = await c.req.header("authorization");
        if (!token) {
            c.status(403);
            return c.json({
                message : "Unauthorized request"
            })
        };
        const user = await verify(token, "secret");
        if (user) {
            //@ts-ignore
            c.req.userId = user.id;
            console.log("userId", user.id);
            await next();
        }
        else {
            c.status(403);
            return c.json({
                message : "Unauthorized request"
            })
        }

    }
    catch (err) {
        c.status(500);
        return c.json({
            message : "Error occured" + err ? err : "middleware router"
        })
    }
}