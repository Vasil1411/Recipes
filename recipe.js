const { Router } = require('express');
const { isUser } = require ('../middlewares/guards')
const { body, validationResult } = require('express-validator');
const { parseError } = require('../util');
const { create, getById, update, deleteById, addVote } = require('../services/recipe')

const recipeRouter = Router()

recipeRouter.get('/create', isUser(), (req,res) => {
    res.render('create')
})

recipeRouter.post('/create',isUser() , 
body('title').trim().isLength({ min: 2}).withMessage('must be at least 2 letters long'),
body('ingredients').trim().isLength({ min: 10, max:200}).withMessage('must be at least 10 and max 200 letters long'),
body('instructions').trim().isLength({ min: 10}).withMessage('must be at least 10 letters long'),
body('description').trim().isLength({ min: 10, max: 100}).withMessage('must be at least 10 and max 100 letters long'),
    


async(req,res) => {
    const userId = req.user._id
    try {
        const validation = validationResult(req)

        if (validation.errors.length) {
            throw validation.errors;
        }

       
        const result = await create(req.body, userId)

        res.redirect('/catalog')
    } catch (err) {
        res.render('create', { data: req.body, errors: parseError(err).errors })
    }


})


recipeRouter.get('/edit/:id', isUser(), async(req,res) => {

    const id = req.params.id

    const recipe = await getById(id)

    if (!recipe) {
        res.status(404).render('404')
        return;
    }

   

    res.render('edit' ,{ data : recipe})
})

recipeRouter.post('/edit/:id',isUser() , 
body('title').trim().isLength({ min: 2}).withMessage('must be at least 2 letters long'),
body('ingredients').trim().isLength({ min: 10, max:200}).withMessage('must be at least 10 and max 200 letters long'),
body('instructions').trim().isLength({ min: 10}).withMessage('must be at least 10 letters long'),
body('description').trim().isLength({ min: 10, max: 100}).withMessage('must be at least 10 and max 100 letters long'),
    


async(req,res) => {
    const userId = req.user._id
    const recipeId = req.params.id

    try {
        const validation = validationResult(req)

        if (validation.errors.length) {
            throw validation.errors;
        }

        const result = await update(recipeId, req.body, userId)

        res.redirect('/catalog/' + recipeId)
    } catch (err) {
        res.render('edit', { data: req.body, errors: parseError(err).errors })
    }


})

recipeRouter.get('/delete/:id', isUser(), async(req,res) => {

    const id = req.params.id

    try {
      
        await deleteById(id, req.user._id)

        res.redirect('/catalog')
       
    } catch (err) {

        if(err.message == 'Access denied!') {
            res.redirect('/login')
            return;
        }
        res.redirect('/catalog')
    }
})


recipeRouter.get('/vote/:recipeId', isUser(), async(req,res) => {

    const userId = req.user._id
    const recipeId = req.params.recipeId

    try {
     

        const result = await addVote(recipeId, userId)

        res.redirect('/catalog/' + recipeId)
    } catch (err) {
        res.redirect('/catalog/' + recipeId)
    }

})

module.exports = {
    recipeRouter
}