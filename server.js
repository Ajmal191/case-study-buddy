require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// XAI API configuration
const XAI_API_KEY = process.env.XAI_API_KEY;

const buildPrompt = (scenario, tone, focus, industry) => `
You are a case study author for Harvard Business School. Transform the following scenario into a concise, professionally written case study using this structure:

1. Title  
2. Abstract  
3. Context  
4. Protagonist  
5. Dilemma / Decision Point  
6. Teaching Objectives  
7. Discussion Questions  

Scenario: ${scenario}  
Tone: ${tone}  
Primary focus: ${focus}  
Industry: ${industry}  

Avoid fictional names unless requested. Keep total length to 750–1000 words. Use a formal, engaging tone suitable for executive education. Include a clearly defined named protagonist, and situate the dilemma within a specific moment or decision context (e.g., a board meeting, internal deadline, public statement).
`;

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/generate", async (req, res) => {
  const { scenario, tone, focus, industry } = req.body;

  // Check if API key is available
  if (!XAI_API_KEY) {
    console.error('XAI_API_KEY not found in environment variables');
    return res.status(500).json({ error: 'API key not configured' });
  }

  // Debug API key (show first 10 chars)
  console.log('API Key found:', XAI_API_KEY.substring(0, 10) + '...');
  console.log('API Key length:', XAI_API_KEY.length);

  try {
    console.log('Making request to XAI API...');
    console.log('Request payload:', {
      model: 'x-1',
      max_tokens: 1200,
      temperature: 0.7,
      message_length: buildPrompt(scenario, tone, focus, industry).length
    });

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'grok-2',
        messages: [
          {
            role: 'user',
            content: buildPrompt(scenario, tone, focus, industry)
          }
        ],
        max_tokens: 1200,
        temperature: 0.7
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('XAI API Error:', response.status, errorText);
      
      // Try to parse error as JSON for better debugging
      try {
        const errorJson = JSON.parse(errorText);
        console.error('Parsed error:', errorJson);
        throw new Error(`XAI API error: ${response.status} - ${errorJson.error || errorJson.message || errorText}`);
      } catch (parseError) {
        throw new Error(`XAI API error: ${response.status} - ${errorText}`);
      }
    }

    const data = await response.json();
    console.log('XAI API Response received');
    res.json({ output: data.choices[0].message.content.trim() });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/analyze', async (req, res) => {
    try {
        const { caseStudy, question } = req.body;
        
        if (!caseStudy || !question) {
            return res.status(400).json({ 
                error: 'Both case study content and question are required.' 
            });
        }
        
        // For now, we'll provide a basic analysis
        // In a real application, you would integrate with an AI service
        const analysis = await analyzeCaseStudy(caseStudy, question);
        
        res.json({ analysis });
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            error: 'An error occurred while analyzing the case study.' 
        });
    }
});

app.post('/reflect', async (req, res) => {
    const { caseText } = req.body;

    if (!caseText) {
        return res.status(400).json({ 
            error: 'Case text is required.' 
        });
    }

    try {
        console.log('Generating reflection questions...');
        
        const reflectionPrompt = `
You are an executive coach preparing a student to discuss the following business case. Create a set of 5 thoughtful, reflective questions to help the learner prepare for in-depth class participation. The questions should focus on personal insight, leadership mindset, ethical awareness, and decision-making approach.

Here are examples of the type of questions you should generate:

- How would you personally feel about pursuing external funding at the cost of dilution?
- What assumptions might be clouding the team's view of acquisition?
- Which path aligns with your own leadership values—control or impact?
- How do you weigh long-term vision against short-term survival?
- What kind of leadership presence would be most effective in the board meeting?

Case Summary:
${caseText}

Generate 5 questions in the same style as the examples above. Only return the list of questions. Do not repeat the summary.
`;

        const response = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${XAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'grok-2',
                messages: [
                    {
                        role: 'user',
                        content: reflectionPrompt
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Reflection API Error:', response.status, errorText);
            throw new Error(`Reflection API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Reflection questions generated');
        res.json({ output: data.choices[0].message.content.trim() });
        
    } catch (err) {
        console.error('Reflection error:', err);
        res.status(500).json({ error: err.message });
    }
});

async function analyzeCaseStudy(caseStudy, question) {
    // This is a placeholder analysis function
    // In a real implementation, you would call an AI service like OpenAI
    
    const analysis = `
# Case Study Analysis

## Key Points Identified
Based on the provided case study content, here are the main points:

- **Context**: The case study presents a business scenario that requires analysis
- **Stakeholders**: Multiple parties are involved in the situation
- **Challenges**: Several issues need to be addressed

## Response to Your Question
"${question}"

The case study content provides relevant information to address your specific question. The analysis suggests:

1. **Primary Considerations**: Focus on the main business objectives
2. **Risk Assessment**: Evaluate potential challenges and opportunities
3. **Strategic Recommendations**: Consider long-term implications

## Next Steps
- Review the analysis thoroughly
- Consider alternative approaches
- Develop an action plan based on the findings

*Note: This is a basic analysis. For more detailed insights, consider using an AI-powered analysis service.*
    `;
    
    return analysis;
}

// Debug endpoint to check environment variables
app.get('/debug', (req, res) => {
    res.json({
        message: 'Server is running',
        apiKeyExists: !!process.env.GROK_API_KEY,
        apiKeyLength: process.env.GROK_API_KEY ? process.env.GROK_API_KEY.length : 0,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        allEnvVars: Object.keys(process.env).filter(key => key.includes('API') || key.includes('GROK') || key.includes('XAI')),
        envVarValues: {
            GROK_API_KEY: process.env.GROK_API_KEY ? 'EXISTS' : 'NOT FOUND',
            XAI_API_KEY: process.env.XAI_API_KEY ? 'EXISTS' : 'NOT FOUND',
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Case Study Buddy server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
}); 