import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { middleware } from './middleware'

export const postRouter = new Hono()

const prisma = new PrismaClient();


postRouter.post("/", middleware, async (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const body = await c.req.json();
    try {
        //@ts-ignore
        const userId = await c.req.userId;
        const createPost = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            },
            select: {
                id: true
            }
        });
        c.status(200);
        return c.json({
            message: "Post created successfully",
            id: createPost.id
        })
    }
    catch (err) {
        c.status(500);
        return c.json({
            message: "Error occured " + err ? err : "post router"
        })
    }

});

postRouter.post("/:id", middleware, async (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const id = await c.req.param('id');
    const body = await c.req.json();
    try {
        const existPost = await prisma.post.findUnique({
            where: {
                id: id
            }
        });
        if (!existPost) {
            c.status(403)
            return c.json({
                message : "Post didn't exists"
            })
        }

        const updatePost = await prisma.post.update({
            where: {
                id: id
            },
            data: {
                title: body.title,
                content: body.content
            },
            select: {
                id: true
            }
        });
        c.status(200)
        return c.json({
            message: "Post successfully updated!",
            id : updatePost.id
        })
    }
    catch (err) {
        c.status(500);
        return c.json({
            message: "Error occured " + err ? err : "update post router"
        })
    }
})


postRouter.get("/:id", middleware, async (c) => { 
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    try {
        const id = await c.req.param('id');
        if (!id) {
            c.status(403)
            return c.json({
                message : "Provide id to get blog details"
            })
        }
        const postDetail = await prisma.post.findUnique({
            where: {
                id : id
            }
        })
        c.status(200)
        return c.json({
            Post : postDetail
        })
    }
    catch (err) {
        c.status(500);
        return c.json({
            message: "Error occured " + err ? err : "get post router"
        })
    }
})