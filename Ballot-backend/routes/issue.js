const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary'); // Cloudinary SDK
const Issue = require('../models/Issue');
require('dotenv').config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create an issue
router.post('/create', upload.single('media'), async (req, res) => {
    try {
        const {
            name,
            isPostedByAnonymous,
            address,
            concerningAuthority,
            issueCategory,
            description
        } = req.body;

        let mediaUrl = null;

        // Upload to Cloudinary if a file is provided
        if (req.file) {
            try {
                // Use a Promise to handle the Cloudinary upload
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });

                mediaUrl = result.secure_url;
            } catch (uploadError) {
                return res.status(500).json({ error: 'Cloudinary upload failed', details: uploadError });
            }
        }

        // Create a new issue document
        const issue = new Issue({
            name,
            media: mediaUrl ? [{
                type: req.file.mimetype.startsWith('image') ? 'image' : 'video',
                url: mediaUrl
            }] : [],
            isPostedByAnonymous,
            address,
            concerningAuthority,
            issueCategory,
            description,
        });

        // Save the issue to the database
        await issue.save();
        res.status(201).json({ message: 'Issue created successfully', issue });
    } catch (err) {
        console.error('Error creating issue:', err);
        res.status(500).json({ error: err.message });
    }
});

// Fetch issues (optional: filter by parameters like category, address, etc.)
router.get('/fetch', async (req, res) => {
    try {
        // Extract query parameters for filtering, if any
        const { issueCategory, address, isPostedByAnonymous } = req.query;

        let filter = {};

        // Apply filters if provided
        if (issueCategory) {
            filter.issueCategory = issueCategory;
        }
        if (address) {
            filter.address = { $regex: address, $options: 'i' }; // Case-insensitive search
        }
        if (isPostedByAnonymous !== undefined) {
            filter.isPostedByAnonymous = isPostedByAnonymous === 'true';
        }

        // Fetch issues based on filter
        const issues = await Issue.find(filter);

        if (issues.length === 0) {
            return res.status(404).json({ message: 'No issues found' });
        }

        res.status(200).json({ issues });
    } catch (err) {
        console.error('Error fetching issues:', err);
        res.status(500).json({ error: err.message });
    }
});

// Fetch issue by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        res.status(200).json(issue);
    } catch (err) {
        console.error('Error fetching issue:', err);
        res.status(500).json({ error: err.message });
    }
});


// Add a comment to an issue
router.post('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        issue.comments.push({
            author: 'Anonymous', // You can modify this based on authentication
            text,
            createdAt: new Date()
        });

        await issue.save();
        res.status(201).json({ message: 'Comment added successfully', comment: issue.comments.slice(-1)[0] });
    } catch (err) {
        console.error('Error adding comment:', err);
        res.status(500).json({ error: err.message });
    }
});



// Updated voting routes
router.post('/:id/upvote', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;  // Get from authentication

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        // Check if user already voted
        const existingVote = issue.votedUsers.find(vote => vote.userId === userId);

        if (existingVote) {
            if (existingVote.voteType === 'upvote') {
                return res.status(400).json({ message: 'Already upvoted' });
            }
            if (existingVote.voteType === 'downvote') {
                issue.downvotes--;
                existingVote.voteType = 'upvote';
                issue.upvotes++;
            }
        } else {
            issue.votedUsers.push({ userId, voteType: 'upvote' });
            issue.upvotes++;
        }

        await issue.save();
        res.status(200).json({
            message: 'Upvoted successfully',
            upvotes: issue.upvotes,
            downvotes: issue.downvotes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Similar logic for downvote route
router.post('/:id/downvote', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;  // Get from authentication

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }

        const existingVote = issue.votedUsers.find(vote => vote.userId === userId);

        if (existingVote) {
            if (existingVote.voteType === 'downvote') {
                return res.status(400).json({ message: 'Already downvoted' });
            }
            if (existingVote.voteType === 'upvote') {
                issue.upvotes--;
                existingVote.voteType = 'downvote';
                issue.downvotes++;
            }
        } else {
            issue.votedUsers.push({ userId, voteType: 'downvote' });
            issue.downvotes++;
        }

        await issue.save();
        res.status(200).json({
            message: 'Downvoted successfully',
            upvotes: issue.upvotes,
            downvotes: issue.downvotes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
