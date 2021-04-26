const router = require('express').Router();
const { Blog } = require('../../models');
const withAuth = require('../../utils/auth');

// CREATE a Blog
router.post('/', withAuth, async (req, res) => {
    try {
        const blogData = await Blog.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(blogData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete Blog by ID
router.delete('/:id', withAuth, async (req, res) => {
    try {
        const blogEntry = await Blog.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id,
            },
        });

        if (!blogEntry) {
            res.status(404).json({ message: 'No blog entry found with that id!' });
            return;
        };

        res.status(200).json(blogEntry);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Find Blog by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const blogEntry = await Blog.findByPk(req.params.id, {
//             include: [{ model: User }],
//         });

//         if (!blogEntry) {
//             res.status(404).json({ message: 'No blog post found with that id!' });
//             return;
//         }

//         res.status(200).json(blogEntry);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// Find all Blogs
// router.get('/', async (req, res) => {
//     try {
//         const blogData = await Blog.findAll({
//             include: [{ model: User }],
//         });
//         res.status(200).json(blogData);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });



module.exports = router;