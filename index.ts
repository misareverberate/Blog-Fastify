import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import multipart from '@fastify/multipart'
import connectToDatabase from './database'
import Post from './models/Posts'
const fastify = Fastify({logger: true})

connectToDatabase()
fastify.register(multipart, {attachFieldsToBody: 'keyValues'})
/**
 * Contém todas as informações de um post do blog
 */
interface Post{
    id:string
    title:string
    description:string
    post_cover:string
    post_date:string|null
    post_content:string 
    post_category:string
    post_tags:string | string[]
}

fastify.post('/create-post', async (request:FastifyRequest, reply:FastifyReply) => {
    const postData:Post = request.body as Post
    postData.id = postData.title.replaceAll(' - ', '-').replaceAll(' ', '-')
    if (typeof postData.post_tags === 'string') {
        postData.post_tags = postData.post_tags.split(',')
    }
    try {
        const newPost = new Post({...postData})
        await newPost.save()
    } catch (error) {
        return reply.code(501).send({responde: `Erro ao salvar o post: ${error}`})
    }
    reply.code(201).send({response: 'Post Criado com Sucesso', data: postData})
}) 

fastify.delete('/delete-post/:postId', async (request:FastifyRequest, reply:FastifyReply) => {
    const {postId} = request.query as any
    console.log(postId)
    try {
        await Post.deleteOne({id: postId})
    } catch (error) {
        return reply.code(501).send({responde: `Erro ao apagar o post: ${error}`})
    }
    reply.code(201).send({response: 'Post apagado com sucesso'})
}) 

try {
  await fastify.listen({ port: 3500 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}