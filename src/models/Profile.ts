import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Please provide an ID'],
        unique: true,
    },
    age: {
        type: Number,
        required: [true, 'Please provide an age'],
    },
    height: {
        type: String,
        required: [true, 'Please provide a height'],
    },
    education: {
        type: String,
        required: [true, 'Please provide education details'],
    },
    district: {
        type: String,
        required: [true, 'Please provide a district'],
    },
    image: {
        type: String, // Base64 string for now
        required: false,
    },
}, {
    timestamps: true,
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
