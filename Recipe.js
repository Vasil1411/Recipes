const {Schema, model, Types} = require('mongoose')

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    recommendList: {
        type: [Schema.Types.ObjectId],
        required: true,
        default: []
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Recipe = model('Recipe',recipeSchema)

module.exports = { Recipe }





