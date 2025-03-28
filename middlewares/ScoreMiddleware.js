
const scoreMiddleware = {
    validateScoreInput: (req, res, next) => {
      const { fluencyScore, vocabularyScore, coherenceScore } = req.body;
      
      if (!fluencyScore || !vocabularyScore || !coherenceScore) {
        return res.status(400).json({
          success: false,
          error: 'All scores are required'
        });
      }
  
      if (fluencyScore < 0 || vocabularyScore < 0 || coherenceScore < 0) {
        return res.status(400).json({
          success: false,
          error: 'Scores cannot be negative'
        });
      }
  
      next();
    },
  
    validateChallengeScore: (req, res, next) => {
      const { challengeType, level, score } = req.body;
      
      if (!challengeType || !level || score === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Challenge type, level, and score are required'
        });
      }
  
      const validTypes = ['vocabulary', 'coherence', 'fluency'];
      const validLevels = ['beginner', 'intermediate', 'advanced'];
  
      if (!validTypes.includes(challengeType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid challenge type'
        });
      }
  
      if (!validLevels.includes(level)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid level'
        });
      }
  
      if (score < 0 || score > 100) {
        return res.status(400).json({
          success: false,
          error: 'Score must be between 0 and 100'
        });
      }
  
      next();
    }
  };
  
  module.exports = scoreMiddleware;