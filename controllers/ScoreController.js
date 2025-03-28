import Score from "../models/Score.js";

export const submitScore = async (req, res) => {
    try {
        const { userId, challengeType, level, score, timeTaken } = req.body;
        let scoreField = {};
        
        switch(challengeType) {
            case 'fluency':
                scoreField.fScore = score;
                break;
            case 'vocabulary':
                scoreField.vScore = score;
                break;
            case 'coherence':
                scoreField.cScore = score;
                break;
        }

        const newScore = new Score({
            fid: userId,
            ...scoreField,
            level,
            challenge_type: challengeType,
            time_taken: timeTaken,
            completion_status: true
        });

        await newScore.save();
        res.status(200).json(newScore);
    } catch (error) {
        res.status(500).json({ error: 'Error submitting score' });
    }
};

export const getScoreHistory = async (req, res) => {
    try {
        const { userId, challengeType, level } = req.query;
        const query = { fid: userId };
        
        if (challengeType) query.challenge_type = challengeType;
        if (level) query.level = level;

        const scores = await Score.find(query)
            .sort({ created_at: -1 })
            .limit(10);

        res.status(200).json(scores);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching score history' });
    }
};

export const getLevelProgress = async (req, res) => {
    try {
        const { userId, challengeType } = req.query;
        const scores = await Score.find({
            fid: userId,
            challenge_type: challengeType,
            completion_status: true
        });

        const progress = {
            beginner: scores.filter(s => s.level === 'beginner').length,
            intermediate: scores.filter(s => s.level === 'intermediate').length,
            advanced: scores.filter(s => s.level === 'advanced').length
        };

        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching progress' });
    }
};