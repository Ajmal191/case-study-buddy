// Template scenarios for quick start
const templates = {
    startup: {
        scenario: "A tech startup in the fintech space has developed an innovative payment solution that's gaining traction. However, they're running out of funding and need to decide between pursuing a Series A round, being acquired by a larger company, or pivoting their business model to focus on a different market segment. The founding team is divided on the best path forward.",
        tone: "professional",
        focus: "strategy",
        industry: "technology"
    },
    merger: {
        scenario: "Two competing retail chains are considering a merger to compete with larger e-commerce players. The merger would create the largest brick-and-mortar retail presence in their region, but would require significant layoffs and store closures. The CEOs must decide whether to proceed with the merger, and if so, how to handle the integration challenges and communicate with stakeholders.",
        tone: "professional",
        focus: "leadership",
        industry: "retail"
    },
    crisis: {
        scenario: "A manufacturing company discovers that one of their products has a safety defect that could potentially harm consumers. The defect affects 10% of their inventory, and a recall would cost millions of dollars and damage their reputation. The executive team must decide how to handle the crisis, whether to issue a recall, and how to communicate with customers and regulators.",
        tone: "formal",
        focus: "ethics",
        industry: "manufacturing"
    },
    innovation: {
        scenario: "A healthcare company has developed a breakthrough medical device that could revolutionize treatment for a common condition. However, the device requires FDA approval, which could take years, and competitors are working on similar solutions. The company must decide whether to pursue the lengthy approval process, seek partnerships with larger companies, or focus on international markets first.",
        tone: "academic",
        focus: "innovation",
        industry: "healthcare"
    }
};

// Load template scenarios
function loadTemplate(templateName) {
    const template = templates[templateName];
    if (template) {
        document.getElementById('scenario').value = template.scenario;
        document.getElementById('tone').value = template.tone;
        document.getElementById('focus').value = template.focus;
        document.getElementById('industry').value = template.industry;
        
        // Show success message
        showMessage('Template loaded successfully!', 'success');
    }
}

// Show messages to user
function showMessage(message, type = 'error') {
    const outputSection = document.getElementById('output');
    const outputContent = document.getElementById('outputContent');
    
    outputSection.style.display = 'block';
    outputContent.innerHTML = `<div class="${type}">${message}</div>`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            outputSection.style.display = 'none';
        }, 3000);
    }
}

// Generate case study
async function generateCase() {
    const scenario = document.getElementById('scenario').value.trim();
    const tone = document.getElementById('tone').value;
    const focus = document.getElementById('focus').value;
    const industry = document.getElementById('industry').value;
    
    // Validate inputs
    if (!scenario) {
        showMessage('Please enter a business scenario to generate a case study.');
        return;
    }
    
    // Update button state
    const generateBtn = document.getElementById('generateBtn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '🔄 Generating...';
    generateBtn.disabled = true;
    
    // Show output section with loading
    const outputSection = document.getElementById('output');
    const outputContent = document.getElementById('outputContent');
    const stats = document.getElementById('stats');
    
    outputSection.style.display = 'block';
    outputContent.innerHTML = '<div class="loading">🤖 AI is crafting your Harvard Business School case study...</div>';
    stats.style.display = 'none';
    
    // Track generation time
    const startTime = Date.now();
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scenario,
                tone,
                focus,
                industry
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Display the generated case study with proper HTML formatting
        const formattedOutput = formatCaseStudyForDisplay(data.output);
        outputContent.innerHTML = formattedOutput;
        
        // Calculate and display stats
        const generationTime = Math.round((Date.now() - startTime) / 1000);
        const wordCount = data.output.split(/\s+/).length;
        
        document.getElementById('wordCount').textContent = `${wordCount} words`;
        document.getElementById('generationTime').textContent = `${generationTime}s`;
        stats.style.display = 'flex';
        
        // Add copy button functionality
        addCopyButton();
        
        // Add PDF download button
        addPdfButton();
        
        // Show reflection prompt
        document.getElementById('reflectionPrompt').style.display = 'block';
        
    } catch (error) {
        console.error('Error:', error);
        outputContent.innerHTML = `<div class="error">❌ Error generating case study: ${error.message}</div>`;
    } finally {
        // Reset button state
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
    }
}

// Format case study content for proper HTML display
function formatCaseStudyForDisplay(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    let html = '';
    let inList = false;
    let listType = ''; // 'ul' or 'ol'

    lines.forEach(line => {
        // Section headers
        if (/^Title$/i.test(line)) {
            html += '<h2>Title</h2>';
        } else if (/^Abstract$/i.test(line)) {
            html += '<h3>Abstract</h3>';
        } else if (/^Context$/i.test(line)) {
            html += '<h3>Context</h3>';
        } else if (/^Protagonist$/i.test(line)) {
            html += '<h3>Protagonist</h3>';
        } else if (/^Dilemma\s*\/\s*Decision Point$/i.test(line)) {
            html += '<h3>Dilemma / Decision Point</h3>';
        } else if (/^Teaching Objectives$/i.test(line)) {
            if (inList) html += `</${listType}>`;
            html += '<h3>Teaching Objectives</h3><ul>';
            inList = true;
            listType = 'ul';
        } else if (/^Discussion Questions$/i.test(line)) {
            if (inList) html += `</${listType}>`;
            html += '<h3>Discussion Questions</h3><ol>';
            inList = true;
            listType = 'ol';
        } else if (inList && line.match(/^\d+\.\s/)) {
            html += `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
        } else if (inList && line.match(/^[-*]\s/)) {
            html += `<li>${line.replace(/^[-*]\s*/, '')}</li>`;
        } else {
            html += `<p>${line}</p>`;
        }
    });

    if (inList) html += `</${listType}>`;

    return `<div class="case-output">${html}</div>`;
}

// Add copy button functionality
function addCopyButton() {
    const outputContent = document.getElementById('outputContent');
    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '📋 Copy Case Study';
    copyBtn.style.cssText = `
        background: #667eea;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        margin-top: 15px;
        font-size: 14px;
    `;
    
    copyBtn.onclick = async () => {
        try {
            await navigator.clipboard.writeText(outputContent.textContent);
            copyBtn.innerHTML = '✅ Copied!';
            copyBtn.style.background = '#28a745';
            setTimeout(() => {
                copyBtn.innerHTML = '📋 Copy Case Study';
                copyBtn.style.background = '#667eea';
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    outputContent.appendChild(copyBtn);
}

// Add PDF download button functionality
function addPdfButton() {
    const outputContent = document.getElementById('outputContent');
    const pdfBtn = document.createElement('button');
    pdfBtn.className = 'pdf-btn';
    pdfBtn.innerHTML = '📄 Download PDF';
    
    pdfBtn.onclick = () => {
        try {
            pdfBtn.innerHTML = '🔄 Preparing PDF...';
            pdfBtn.disabled = true;
            
            // Copy content to printable container
            const printableCaseStudy = document.getElementById('printableCaseStudy');
            printableCaseStudy.innerHTML = outputContent.innerHTML;
            
            // Trigger print
            printPDF();
            
            pdfBtn.innerHTML = '✅ PDF Ready!';
            pdfBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            
            setTimeout(() => {
                pdfBtn.innerHTML = '📄 Download PDF';
                pdfBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                pdfBtn.disabled = false;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            pdfBtn.innerHTML = '❌ PDF Failed';
            pdfBtn.style.background = '#dc3545';
            setTimeout(() => {
                pdfBtn.innerHTML = '📄 Download PDF';
                pdfBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                pdfBtn.disabled = false;
            }, 2000);
        }
    };
    
    outputContent.appendChild(pdfBtn);
}

// Print PDF function
function printPDF() {
    const printable = document.getElementById("printableContent");
    printable.style.display = "block";
    window.print();
    printable.style.display = "none";
}

// Get coaching questions function
async function getCoachingQuestions() {
    try {
        const reflectionBtn = document.querySelector('.reflection-btn');
        reflectionBtn.innerHTML = '🔄 Generating questions...';
        reflectionBtn.disabled = true;
        
        const caseText = document.getElementById('outputContent').textContent;
        
        const response = await fetch('/reflect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ caseText })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Format the coaching questions
        const questions = data.output
            .split('\n')
            .filter(line => line.trim())
            .map(line => `<li>${line.replace(/^\d+\.\s*/, '')}</li>`)
            .join('');
        
        document.getElementById('coachingOutput').innerHTML = `
            <h3>🧠 Reflection Questions</h3>
            <ul>${questions}</ul>
        `;
        
        reflectionBtn.innerHTML = '✅ Questions Generated!';
        reflectionBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        
        setTimeout(() => {
            reflectionBtn.innerHTML = 'Yes, generate reflection prompts';
            reflectionBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            reflectionBtn.disabled = false;
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('coachingOutput').innerHTML = `
            <div class="error">❌ Error generating reflection questions: ${error.message}</div>
        `;
        
        const reflectionBtn = document.querySelector('.reflection-btn');
        reflectionBtn.innerHTML = '❌ Failed';
        reflectionBtn.style.background = '#dc3545';
        
        setTimeout(() => {
            reflectionBtn.innerHTML = 'Yes, generate reflection prompts';
            reflectionBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            reflectionBtn.disabled = false;
        }, 2000);
    }
}

// Keyboard shortcuts
document.addEventListener('DOMContentLoaded', function() {
    // Ctrl+Enter to generate
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            generateCase();
        }
    });
    
    // Auto-resize textarea
    const textarea = document.getElementById('scenario');
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 400) + 'px';
    });
    
    // Focus on scenario textarea when page loads
    textarea.focus();
});

// Add some helpful placeholder text when user clicks on scenario field
document.getElementById('scenario').addEventListener('focus', function() {
    if (!this.value) {
        this.placeholder = `Example: A software company must decide whether to pivot their product strategy after losing their biggest client. The team is divided between doubling down on their current approach or completely changing direction...`;
    }
}); 