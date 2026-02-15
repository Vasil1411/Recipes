const { Router } = require('express');
const { getAll, getById, searchRecipes } = require('../services/recipe');

const catalogRouter = Router()

catalogRouter.get('/catalog', async (req, res) => {

    const recipes = await getAll()

    res.render('catalog', { recipes })
})

catalogRouter.get('/catalog/:id', async (req, res) => {

    const id = req.params.id

    const recipe = await getById(id)

    if (!recipe) {
        res.status(404).render('404')
        return;
    }


    recipe.votes = recipe.recommendList.length
    recipe.hasUser = res.locals.hasUser
    
    recipe.isAuthor = req.user?._id.toString() == recipe.author._id.toString();
    recipe.hasVoted = Boolean(recipe.recommendList.find(v => v.toString() == req.user?._id))


    res.render('details', { recipe })
})


catalogRouter.get('/search', async (req, res) => {

    const { title } = req.query;


    const recipes = await searchRecipes(title)



    res.render('search', { data: { title }, recipes })
})


module.exports = {
    catalogRouter
}