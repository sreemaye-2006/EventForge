const { Groq } = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy-key',
});

const DEFAULT_MODEL = 'llama-3.1-8b-instant';

/**
 * Generate content using Groq AI with intelligent fallback
 */
const generateContent = async (prompt, systemPrompt = 'You are an expert AI event coordinator and conference planner.') => {
  try {
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith('gsk_')) {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        model: DEFAULT_MODEL,
        temperature: 0.7,
        max_tokens: 1500,
      });
      const response = chatCompletion.choices[0]?.message?.content?.trim();
      if (response) return response;
    }
  } catch (error) {
    console.warn('Groq API notice (using fallback generator):', error.message);
  }

  // Fallback high-quality response generator
  return generateFallbackContent(prompt);
};

const generateFallbackContent = (prompt) => {
  const p = prompt.toLowerCase();
  if (p.includes('social media') || p.includes('tweet') || p.includes('linkedin')) {
    return `🚀 Exciting Announcement!\n\nJoin us for an unforgettable experience at our upcoming premier summit. Discover cutting-edge insights, network with visionary industry leaders, and supercharge your skills.\n\n🎟️ Limited passes available! Secure your spot today:\n#EventForge #Innovation #TechConference #Leadership #Networking`;
  }
  if (p.includes('email invitation') || p.includes('invite')) {
    return `Subject: Exclusive Invitation: Join us for an unprecedented industry gathering\n\nDear Leader,\n\nWe are delighted to invite you to participate in our upcoming conference. Designed for innovators, architects, and forward-thinking professionals, this event brings together global pioneers for actionable insights, live demonstrations, and curated executive networking.\n\nReserve your ticket today to guarantee access to all keynotes, breakout tracks, and VIP sessions.\n\nWarm regards,\nThe Event Organizing Committee`;
  }
  if (p.includes('announcement')) {
    return `📢 Important Event Update: We are thrilled to welcome our keynote speakers and unveil our full conference schedule. Please review your personalized agenda and download your digital QR ticket from the attendee portal.`;
  }
  if (p.includes('speaker bio') || p.includes('biography')) {
    return `An internationally recognized technology innovator and engineering leader with over 15 years of experience delivering scalable enterprise architectures, deep AI integrations, and cloud transformation strategies.`;
  }
  return `Join industry pioneers and visionary professionals for an immersive conference featuring world-class keynotes, deep-dive technical workshops, and unmatched networking opportunities designed to accelerate your knowledge and career.`;
};

/**
 * AI Event Assistant Generator - generates comprehensive event package
 */
const generateEventAssistantPack = async ({
  eventName = 'Tech Summit',
  eventType = 'Conference',
  audience = 'Engineers & Tech Leaders',
  industry = 'Technology',
  goals = 'Share best practices and foster networking',
  topics = 'AI, Cloud, Distributed Systems',
  duration = '2 Days',
  location = 'Convention Center'
}) => {
  const prompt = `
Act as an executive event planner. Generate a complete marketing and content kit in strict JSON format for the following event:
Event Name: ${eventName}
Event Type: ${eventType}
Target Audience: ${audience}
Industry: ${industry}
Goals: ${goals}
Topics/Themes: ${topics}
Duration: ${duration}
Location: ${location}

Provide a JSON response with exactly these keys:
{
  "description": "Full detailed event description (2-3 paragraphs)",
  "shortDescription": "Compelling 1-2 sentence elevator pitch",
  "announcement": "Official launch announcement text",
  "speakerBioDraft": "Sample keynote speaker introduction bio template",
  "sessionDescription": "Flagship keynote session description",
  "socialMediaPost": "Engaging LinkedIn/Twitter announcement with hashtags and emojis",
  "emailInvitation": "Formal email invitation with subject line and body"
}
Output ONLY valid JSON.
`;

  try {
    const raw = await generateContent(prompt, 'You are an executive conference content director. Always respond with pure valid JSON.');
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (err) {
    console.warn('JSON parse fallback for AI Assistant Pack:', err.message);
  }

  // Graceful structured fallback
  return {
    description: `Welcome to ${eventName}, the premier ${eventType.toLowerCase()} uniting ${audience} across the ${industry} sector. Over the course of ${duration} in ${location}, attendees will dive deep into ${topics}, unlocking real-world frameworks, actionable methodologies, and cutting-edge innovations.\n\nWhether you are looking to scale your engineering practices, discover emerging trends, or forge lasting partnerships with global industry pioneers, ${eventName} delivers an unparalleled experience tailored to high-impact achievers.`,
    shortDescription: `Join ${audience} at ${eventName} (${duration}, ${location}) for an immersive exploration of ${topics} and high-impact industry networking.`,
    announcement: `🎉 We are thrilled to officially launch ${eventName}! Registration is now open for ${duration} of world-class keynotes, hands-on tracks, and executive networking in ${location}.`,
    speakerBioDraft: `A recognized authority in ${industry}, our keynote speaker has spearheaded transformative initiatives in ${topics}. Renowned for delivering high-impact keynotes across global tech forums, they will share exclusive insights at ${eventName}.`,
    sessionDescription: `Keynote: Pioneering the Future of ${topics} — A strategic blueprint on how modern organizations are leveraging next-generation architectures to drive exponential growth and resilience.`,
    socialMediaPost: `🚀 Announcement: ${eventName} is officially here! Join ${audience} in ${location} for ${duration} of groundbreaking talks on ${topics}. 🎟️ Early Bird passes are live: #EventForge #${industry.replace(/\s+/g, '')} #Innovation #FutureTech`,
    emailInvitation: `Subject: You're Invited: ${eventName} in ${location}\n\nDear Colleague,\n\nWe are pleased to invite you to ${eventName}, taking place over ${duration} in ${location}.\n\nFocused on ${topics}, this event connects leading minds across ${industry} for interactive workshops, visionary keynotes, and curated networking.\n\nSecure your pass today to guarantee access.\n\nBest regards,\nThe ${eventName} Organizing Team`
  };
};

/**
 * Generate Event Description
 */
const generateEventDescription = async (promptText, keywords, category) => {
  const prompt = `Write a compelling 2-3 paragraph event description. Details: ${promptText}. Keywords: ${keywords || 'none'}. Category: ${category || 'General'}.`;
  return generateContent(prompt);
};

/**
 * Generate Speaker Bio
 */
const generateSpeakerBio = async (name, background, expertise) => {
  const prompt = `Write a professional 2-paragraph speaker biography for ${name}. Background: ${background}. Expertise: ${expertise || 'Technology'}.`;
  return generateContent(prompt);
};

/**
 * Generate Session Summary
 */
const generateSessionSummary = async (transcript, title) => {
  const prompt = `Summarize the following session "${title || 'Event Session'}" into a crisp, engaging description:\n${transcript}`;
  return generateContent(prompt);
};

/**
 * Generate Announcement
 */
const generateAnnouncement = async (eventName, context, urgency) => {
  const prompt = `Write a clear, professional announcement for "${eventName}". Context: ${context}. Urgency Level: ${urgency || 'Normal'}.`;
  return generateContent(prompt);
};

/**
 * Generate Social Media Post
 */
const generateSocialMediaPost = async (details) => {
  const prompt = `Create a high-engagement social media post (with hashtags and emojis) for this event:\n${JSON.stringify(details)}`;
  return generateContent(prompt);
};

/**
 * Generate Email Invitation
 */
const generateEmailInvitation = async (details) => {
  const prompt = `Write a formal, persuasive email invitation (including Subject line) for this event:\n${JSON.stringify(details)}`;
  return generateContent(prompt);
};

/**
 * AI Session Recommendation logic with deterministic scoring and AI reasoning
 */
const recommendSessions = async (userInterests = [], availableSessions = []) => {
  if (!availableSessions || availableSessions.length === 0) return [];

  const interests = Array.isArray(userInterests) ? userInterests.map(i => i.toLowerCase()) : [];

  // Score each session based on interest keyword matching
  const scoredSessions = availableSessions.map(session => {
    let score = 0;
    const reasons = [];
    const textToMatch = `${session.title || ''} ${session.description || ''} ${session.category || ''} ${session.track || ''} ${(session.tags || []).join(' ')}`.toLowerCase();

    interests.forEach(interest => {
      if (textToMatch.includes(interest)) {
        score += 30;
        reasons.push(`Matches your interest in ${interest}`);
      }
    });

    if (session.speakerIds && session.speakerIds.length > 0) {
      score += 15;
      reasons.push('Features recognized industry speakers');
    }

    if (score === 0) {
      score = 20; // Default baseline popularity
      reasons.push('Highly rated flagship session');
    }

    return {
      session,
      matchScore: Math.min(score, 99),
      reason: reasons.slice(0, 2).join(' • ')
    };
  });

  // Sort by highest match score
  scoredSessions.sort((a, b) => b.matchScore - a.matchScore);
  return scoredSessions.slice(0, 6);
};

module.exports = {
  generateContent,
  generateEventAssistantPack,
  generateEventDescription,
  generateSpeakerBio,
  generateSessionSummary,
  generateAnnouncement,
  generateSocialMediaPost,
  generateEmailInvitation,
  recommendSessions
};
