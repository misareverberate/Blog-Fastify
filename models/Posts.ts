import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    id:String,
    title:String,
    description:String,
    post_content:String,
    post_date:{type: Date, default: Date.now()},
    post_cover:String,
    post_category:String,
    post_tags:{type: [String]},
})

const Post = mongoose.model('Post', postSchema)

export default Post