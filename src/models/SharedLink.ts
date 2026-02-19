import mongoose from 'mongoose';

const SharedLinkSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    profileIds: {
        type: [String],
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    userMobile: {
        type: String,
        required: false, // Optional, can be captured during payment
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.SharedLink || mongoose.model('SharedLink', SharedLinkSchema);
