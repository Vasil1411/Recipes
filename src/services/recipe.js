const { Recipe } = require('../models/Recipe')

async function getAll() {
    return Recipe.find().lean();
}

async function getById(id) {
    // return Recipe.findById(id).lean();
    return Recipe.findById(id).populate("recommendList").populate("author").lean();
}

async function create(data, authorId) {
    const record = new Recipe ({
        title: data.title,
        description: data.description,
        ingredients: data.ingredients,
        instructions: data.instructions,
        author: authorId
    });

    await record.save();


    return record;
}

async function update(id, data, userId) {
    const record = await Recipe.findById(id);

    if(!record) {
        throw new ReferenceError('Record not found!' + id);
    }

    if(record.author.toString() != userId) {
        throw new Error ('Access denied!')
    }

    record.title = data.title
    record.description = data.description
    record.ingredients = data.ingredients
    record.instructions = data.instructions

    await record.save();

    return record;
}

async function deleteById(id, userId) {

    const record = await Recipe.findById(id);

    if(!record) {
        throw new ReferenceError('Record not found!' + id);
    }

    if(record.author.toString() != userId) {
        throw new Error ('Access denied!')
    }

    await Recipe.findByIdAndDelete(id);

}

async function getRecent() {
    return await Recipe.find().sort({$natural: -1}).limit(3).lean()
}

async function addVote (recipeId, userId) {
    const record = await Recipe.findById(recipeId);

    if(!record) {
        throw new ReferenceError('Record not found!' + recipeId);
    }

    if(record.author.toString() == userId) {
        throw new Error ('Cannot vote for your own publication!')
    }

    if (record.recommendList.find(v => v.toString() == userId)) {
        throw new Error ('Cannot vote more than once!')
    }

    record.recommendList.push(userId);

    await record.save();

    return record;
}

async function getByAuthorId(authorId) {
    return Recipe.find({ author: authorId}.lean());
}


async function searchRecipes (title) {
        const query = {}

        if (title) {
            query.title = new RegExp(title, 'i')
        }

        return Recipe.find(query).lean()
}

module.exports = {
    getAll,
    getById,
    deleteById,
    create,
    update,
    getRecent,
    addVote,
    getByAuthorId,
    searchRecipes
}