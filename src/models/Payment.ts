import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    userMobile: {
        type: String,
        required: [true, 'User mobile is required'],
    },
    bkashNumber: {
        type: String,
        required: [true, 'Bkash number is required'],
    },
    trxId: {
        type: String,
        required: [true, 'Transaction ID is required'],
        unique: true,
    },
    amount: {
        type: String,
        required: [true, 'Amount is required'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    sharedLinkToken: {
        type: String,
        required: false, // Optional, only for shared link payments
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
