import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { useRouter } from './user'
import { postRouter } from './posts'
import { middleware } from './middleware';

const app = new Hono()

app.get('/', (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    return c.text('Hello Hono!')
});

app.route("/api/v1/user", useRouter);
app.route("/api/v1/blog", postRouter);



export default app
