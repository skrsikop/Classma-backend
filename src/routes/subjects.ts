import express  from 'express';


const router = express.Router();

// Get all subjects with optional search filtering and paggination
router.get('/', async (req,res) => {
    try {
        const {search , department, page = 1, limit = 10} = req.query;

        const currentPage = Math.max(1, + page);
        const limitPerPage = Math.max(1, + limit);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get subjects' });
    }
})