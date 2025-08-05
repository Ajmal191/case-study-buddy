# 📚 Case Study Buddy

A web application for generating Harvard Business School-style case studies with AI assistance and reflection coaching.

## ✨ Features

- **AI-Powered Case Study Generation** - Create professional case studies using Grok AI API
- **Harvard Business School Format** - Structured case studies with Title, Abstract, Context, Protagonist, Dilemma, Teaching Objectives, and Discussion Questions
- **Reflection Mode** - Get personalized coaching questions to prepare for case discussions
- **PDF Export** - Download case studies as professional PDFs
- **Template Library** - Quick-start templates for common business scenarios
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- XAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/case-study-buddy.git
   cd case-study-buddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=3003
   NODE_ENV=development
   XAI_API_KEY=your_xai_api_key_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3003`

## 🎯 How to Use

### Generating a Case Study

1. **Enter a business scenario** in the text area
2. **Select options**:
   - Writing tone (Professional, Academic, Conversational, Formal)
   - Learning focus (Leadership, Strategy, Innovation, etc.)
   - Industry (Technology, Healthcare, Finance, etc.)
3. **Click "Generate Case Study"**
4. **Review the generated case study**

### Using Templates

- Click on template buttons like "Startup Challenge" or "Merger Dilemma"
- Templates automatically populate the form with sample scenarios
- Customize the scenario and settings as needed

### Reflection Mode

- After generating a case study, click "Yes, generate reflection prompts"
- Get 5 personalized coaching questions to prepare for discussions
- Questions focus on personal insight, leadership mindset, and decision-making

### Exporting to PDF

- Click "📄 Download PDF" after generating a case study
- PDF will open in your browser's print dialog
- Save as PDF for professional documentation

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI**: XAI Grok API
- **PDF Generation**: Browser print-to-PDF
- **Styling**: Custom CSS with modern gradients and animations

## 📁 Project Structure

```
case-study-buddy/
├── server.js              # Express server and API endpoints
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in repo)
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/               # Static files
    ├── index.html        # Main application page
    ├── script.js         # Frontend JavaScript
    └── favicon.svg       # Application icon
```

## 🔧 API Endpoints

- `POST /generate` - Generate case study from scenario
- `POST /reflect` - Generate reflection questions
- `POST /analyze` - Analyze case study (placeholder)

## 🎨 Features in Detail

### Case Study Structure
Each generated case study includes:
- **Title** - Clear, descriptive title
- **Abstract** - Executive summary
- **Context** - Background and situation
- **Protagonist** - Key decision maker
- **Dilemma/Decision Point** - Core challenge
- **Teaching Objectives** - Learning goals
- **Discussion Questions** - Thought-provoking questions

### Reflection Questions
AI-generated coaching questions focus on:
- Personal insight and values
- Leadership mindset
- Ethical awareness
- Decision-making approach
- Strategic thinking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Harvard Business School for case study methodology
- XAI for providing the Grok AI API
- The open-source community for inspiration and tools
- Made with Cursor and a lot of support from ChatGPT

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Made with ❤️ for higher education, professional development and lifelong learning** 
