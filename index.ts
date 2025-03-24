import Fastify from 'fastify'
import multipart from '@fastify/multipart'
const fastify = Fastify({logger: true})

fastify.register(multipart, {attachFieldsToBody: 'keyValues'})

fastify.get('/create-post', async (request, reply) => {
    const {title, caption, post_content, post_cover} = request.body
}) 
fastify.get('/delete-post', async (request, reply) => {

}) 

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}