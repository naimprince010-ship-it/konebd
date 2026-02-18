import mongoose from 'mongoose';

const MatchRequestSchema = new mongoose.Schema({
    userMobile: {
        type: String,
        required: [true, 'User mobile is required'],
    },
    selectedProfileIds: {
        type: [String],
        required: [true, 'Selected Profile IDs are required'],
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'resolved'],
        default: 'pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.MatchRequest || mongoose.model('MatchRequest', MatchRequestSchema);
