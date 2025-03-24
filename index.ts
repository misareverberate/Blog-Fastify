import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import multipart from '@fastify/multipart'
import connectToDatabase from './database'
import Post from './models/Posts'
const fastify = Fastify({logger: true})

connectToDatabase()
fastify.register(multipart, {attachFieldsToBody: 'keyValues'})
/**
 * Contém todas as informações de um post do blog
 * 
 */
interface Post{
    /**
     * O id do post, atualment, corresponde ao id da rota dentro do blog. 
     * 
     *  O id específico dentro do banco é o padrão _id gerado automaticamente
     * 
     * Exemplo: seublog.com/post/um-dia-no-Brasil
     */
    id:string
    title:string
    description:string
    post_cover:string
    post_date:string|null
    post_content:string 
    post_category:string
    post_tags:string | string[]
}

//Criação de um post
fastify.post('/create-post', async (request:FastifyRequest, reply:FastifyReply) => {
    const postData:Post = request.body as Post
    //Pretendo avaliar outro formato de representar o id
    postData.id = postData.title.replaceAll(' - ', '-').replaceAll(' ', '-')
    
    if (typeof postData.post_tags === 'string') {
        postData.post_tags = postData.post_tags.split(',')
    }
    try {
        const newPost = new Post({...postData})
        await newPost.save()
    } catch (error) {
        return reply.code(501).send({response: `Erro ao salvar o post: ${error}`})
    }
    reply.code(201).send({response: 'Post Criado com Sucesso'})
}) 

fastify.delete('/delete-post/', async (request:FastifyRequest, reply:FastifyReply) => {
    const {postId} = request.query as any
    try {
        await Post.deleteOne({id: postId})
    } catch (error) {
        return reply.code(501).send({response: `Erro ao apagar o post: ${error}`})
    }
    reply.code(201).send({response: 'Post apagado com sucesso'})
}) 

fastify.get('/post/:postId', async (request:FastifyRequest, reply:FastifyReply) => {
    const {postId} = request.params as any
    try {
        const postToRetrieve:Post|null = await Post.findOne({id: postId})
        if(!postToRetrieve) throw new Error('O Post solicitado não existe ou não está mais disponível (-_-)')
        reply.code(200).send({response: postToRetrieve})
    } catch (error) {
        return reply.code(400).send({response: error.message})
    }
})

fastify.put('/update-post/', async (request:FastifyRequest, reply:FastifyReply) => {
    const {postId} = request.query as any
    const postData:Post = request.body as Post
    postData.id = postData.title.replaceAll(' - ', '-').replaceAll(' ', '-')
    if (typeof postData.post_tags === 'string') {
        postData.post_tags = postData.post_tags.split(',')
    }
    try {
        if(!(await Post.findOne({id: postId}))) return reply.code(400).send({response: 'O Post socilitado não existe ou está indisponível (~_~)'})
        await Post.updateOne({id: postId}, postData)
        reply.code(201).send({response: 'Post atualizado com sucesso'})
    } catch (error) {
        return reply.code(400).send({response: `Erro ao atualizar o post: ${error.message}`})
    }
})

fastify.get('/posts/', async (request:FastifyRequest, reply:FastifyReply) => {
    try {
        let tags: string[] = [];
        if ((request.query as any).tag) {
            tags = Array.isArray((request.query as any).tag) ? (request.query as any).tag : [(request.query as any).tag];
        }
        const filter = tags.length ? { post_tags: { $in: tags } } : {};
        const postsToRetrieve: Post[] = await Post.find(filter);
        if (!postsToRetrieve) throw new Error('O Post solicitado não existe ou não está mais disponível (-_-)');
        return reply.code(200).send({response: postsToRetrieve });
    } catch (error) {
        return reply.code(400).send({ response: error});
    }
})

try {
  await fastify.listen({ port: 3500 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}