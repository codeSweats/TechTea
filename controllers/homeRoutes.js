const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {
    try {
        const getBlogs = Blog.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                },
            ],
        });

        const blogs = getBlogs.map((blog) => blog.get({ plain: true }));


        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['username'] },],
        });

        const blogPost = blogData.get({ plain: true });

        res.render('blog', {
            ...blogPost,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userDash = await User.findByPk(req.session.user_id, {
            attributes: { exlude: ['password'] },
            include: [{ model: Blog }],
        });

        const dashboard = userDash.get({ plain: true });

        res.render('dashboard', {
            ...dashboard,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }

    res.render('login');
});



module.exports = router;