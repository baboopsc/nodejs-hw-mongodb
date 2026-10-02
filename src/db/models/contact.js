import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, minlength: 3, maxlength: 20 },
    phoneNumber: { type: String, required: true, minlength: 3, maxlength: 20 },
    email: { type: String, minlength: 3, maxlength: 20 },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, enum: ['work', 'home', 'personal'], required: true, default: 'personal' },
    photo: { type: String },
}, { timestamps: true });

export const Contact = mongoose.model('Contact', contactSchema);