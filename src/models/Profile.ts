import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        // ID is optional for new registrations, will be generated
    },
    mobile: {
        type: String,
        required: [true, 'Please provide a mobile number'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        select: false, // Don't return password by default
    },
    securityQuestion: {
        type: String,
        required: [true, 'Please select a security question'],
    },
    securityAnswer: {
        type: String,
        required: [true, 'Please provide a security answer'],
        select: false,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    age: {
        type: Number,
        required: false, // Optional for signup
    },
    height: {
        type: String,
        required: false, // Optional for signup
    },
    education: {
        type: String,
        required: false, // Optional for signup
    },
    district: {
        type: String,
        required: false, // Optional for signup
    },
    image: {
        type: String, // Base64 string for now
        required: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
