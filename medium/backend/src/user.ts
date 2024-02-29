import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


export const useRouter = new Hono()

const prisma = new PrismaClient();

useRouter.post('/signup', async(c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json()
    try {
        const createUser = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password
            },
            select: {
                id:true
            }
        })
        const jwt = await sign({ id: createUser.id }, "secret");
        c.status(200);
        return c.json({
            token : jwt
        })
    }
    catch (err) {
        c.status(500)
        return c.json({
            message : "Error occured" + err ? err : "signup router"
        })
    }
    
})

useRouter.post('/signin', async(c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const body = await c.req.json();
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (!user) {
            c.status(403)
            return c.json({
                message : "Email not found!"
            })
        }
        const token = await sign({ id: user.id }, "secret");
        c.status(200)
        return c.json({
            token : token
        })
    }
    catch (err) {
        c.status(500);
        return c.json({
            message : "Error occured" + err ? err : "signin router"
        })
    }
})