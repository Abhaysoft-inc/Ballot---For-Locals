const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    name: { type: String, required: true },// full name
    media: [
        {
            type: { type: String, required: true }, // Image or video type
            url: { type: String, required: true }  // URL of the media
        }
    ],
    isPostedByAnonymous: { type: Boolean, default: false },
    address: { type: String, required: true },
    datePosted: { type: Date, default: Date.now },
    concerningAuthority: { type: String, required: true },
    issueCategory: { type: String, required: true },
    description: { type: String },
    isSolved: { type: Boolean, default: false },

    comments: [{
        author: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    votedUsers: [{
        userId: String,  // or ObjectId if using authentication
        voteType: { type: String, enum: ['upvote', 'downvote'] }
    }]
});

module.exports = mongoose.model('Issue', issueSchema);
