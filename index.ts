import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import multipart from '@fastify/multipart'
import connectToDatabase from './database'
const fastify = Fastify({logger: true})

fastify.register(multipart, {attachFieldsToBody: 'keyValues'})
/**
 * Contém todas as informações de um post do blog
 */
interface Post{
    id:string
    title:string
    description:string
    post_content:string 
    post_cover:string
    post_category:string
    post_tags:string
}

fastify.post('/create-post', async (request:FastifyRequest, reply:FastifyReply) => {
    const postData:Post = request.body as any
    postData.id = postData.title.replaceAll(' - ', '-').replaceAll(' ', '-')
    
    reply.code(201).send({response: 'Post Criado com Sucesso', data: postData})
}) 
fastify.get('/delete-post', async (request, reply) => {

}) 

try {
  await fastify.listen({ port: 3500 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}