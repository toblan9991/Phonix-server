

import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
    score_id: mongoose.Schema.Types.ObjectId,
    fid: mongoose.Schema.Types.ObjectId,
    fScore: Number,
    vScore: Number,
    cScore: Number,
    created_at: { type: Date, default: Date.now },
    id: mongoose.Schema.Types.ObjectId,
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    challenge_type: {
        type: String,
        enum: ['fluency', 'vocabulary', 'coherence'],
        required: true
    },
    audio_url: String,
    completion_status: {
        type: Boolean,
        default: false
    },
    time_taken: Number,
    attempt_number: {
        type: Number,
        default: 1
    }
});

export default mongoose.model('Score', scoreSchema);    