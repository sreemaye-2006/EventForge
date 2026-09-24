const { Groq } = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key',
});

const DEFAULT_MODEL = 'llama3-8b-8192';

/**
 * Generate content using Groq AI
 * @param {string} prompt - The prompt to send to the model
 * @param {string} model - The model to use
 * @returns {Promise<string>} - The generated content
 */
const generateContent = async (prompt, model = DEFAULT_MODEL) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant for an event management platform.'
        },
        {
          role: 'user',
          content: prompt,
        }
      ],
      model: model,
      temperature: 0.7,
      max_tokens: 1024,
    });
    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error in Groq AI service:', error);
    throw new Error('AI generation failed');
  }
};

/**
 * Generate Event Description
 */
const generateEventDescription = async (details) => {
  const prompt = `Write a compelling event description for the following event details:\n${JSON.stringify(details)}`;
  return generateContent(prompt);
};

/**
 * Generate Speaker Bio
 */
const generateSpeakerBio = async (details) => {
  const prompt = `Write a professional speaker biography based on the following details:\n${JSON.stringify(details)}`;
  return generateContent(prompt);
};

/**
 * Generate Session Summary
 */
const generateSessionSummary = async (details) => {
  const prompt = `Summarize the following event session in a short, engaging paragraph:\n${JSON.stringify(details)}`;
  return generateContent(prompt);
};

/**
 * Generate Announcement
 */
const generateAnnouncement = async (details) => {
  const prompt = `Write an engaging announcement for event attendees about the following:\n${JSON.stringify(details)}`;
  return generateContent(prompt);
};

/**
 * AI Session Recommendation
 * @param {Array<string>} userInterests - Array of user interests
 * @param {Array<Object>} sessions - Array of session objects with tags and descriptions
 * @returns {Promise<string>} - Recommendations
 */
const recommendSessions = async (userInterests, sessions) => {
  const prompt = `Given the user interests: ${userInterests.join(', ')}. Recommend the best sessions from the following list and explain why:\n${JSON.stringify(sessions)}`;
  return generateContent(prompt, 'mixtral-8x7b-32768');
};

module.exports = {
  generateContent,
  generateEventDescription,
  generateSpeakerBio,
  generateSessionSummary,
  generateAnnouncement,
  recommendSessions
};
