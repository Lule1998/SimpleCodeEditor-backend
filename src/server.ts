import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mockResponses = {
  typescript: {
    patterns: [
      {
        match: (code: string) => code.includes('function'),
        response: `// Here's an improved version of your function
function improvedFunction(param: any): any {
  // Input validation
  if (!param) throw new Error('Parameter is required');
  
  // Your logic here
  const result = processData(param);
  
  return result;
}

// Helper function
function processData(data: any): any {
  return data;
}`
      },
      {
        match: (code: string) => code.includes('class'),
        response: `// Here's a better class structure
class ImprovedClass {
  private data: any;

  constructor(initialData: any) {
    this.data = initialData;
  }

  public getData(): any {
    return this.data;
  }

  public setData(newData: any): void {
    this.data = newData;
  }
}

// Usage example
const instance = new ImprovedClass('test');`
      },
      {
        match: (code: string) => code.includes('interface'),
        response: `// Here's an enhanced interface design
interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface YourInterface extends BaseModel {
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  
  // Method signatures
  validate(): boolean;
  toJSON(): Record<string, any>;
}`
      },
      {
        match: (code: string) => code.includes('async'),
        response: `// Here's a better async function pattern
async function improvedAsyncFunction(): Promise<void> {
  try {
    // Start with input validation
    const data = await fetchData();
    
    // Process the data
    const result = await processData(data);
    
    // Handle the result
    return result;
  } catch (error) {
    // Error handling
    console.error('Operation failed:', error);
    throw new Error('Failed to process data');
  }
}`
      }
    ]
  },
  javascript: {
    patterns: [
      {
        match: (code: string) => code.includes('function'),
        response: `// Here's an improved JavaScript function
function improvedFunction(param) {
  // Parameter validation
  if (param === undefined) {
    throw new Error('Parameter is required');
  }
  
  // Your logic here
  const result = processData(param);
  
  return result;
}

// Helper function
function processData(data) {
  return data;
}`
      },
      {
        match: (code: string) => code.includes('class'),
        response: `// Here's a better class structure
class ImprovedClass {
  #privateData; // Private field

  constructor(initialData) {
    this.#privateData = initialData;
  }

  getData() {
    return this.#privateData;
  }

  setData(newData) {
    this.#privateData = newData;
  }
}

// Usage
const instance = new ImprovedClass('test');`
      }
    ]
  },
  html: {
    patterns: [
      {
        match: (code: string) => code.includes('<div'),
        response: `<!-- Here's an improved HTML structure -->
<div class="container">
  <header class="header">
    <h1>Title</h1>
    <nav class="navigation">
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <main class="content">
    <section class="section">
      <h2>Section Title</h2>
      <p>Content goes here</p>
    </section>
  </main>
  
  <footer class="footer">
    <p>&copy; 2024 Your Company</p>
  </footer>
</div>`
      },
      {
        match: (code: string) => code.includes('<form'),
        response: `<!-- Here's an improved form structure -->
<form class="form" action="/submit" method="POST">
  <div class="form-group">
    <label for="name">Name:</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      required 
      class="form-control"
    >
  </div>
  
  <div class="form-group">
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
      class="form-control"
    >
  </div>
  
  <button type="submit" class="btn btn-primary">Submit</button>
</form>`
      }
    ]
  },
  css: {
    patterns: [
      {
        match: (code: string) => code.includes('.container'),
        response: `/* Here's an improved CSS structure */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
}

/* Modern CSS Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Responsive typography */
html {
  font-size: 16px;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}`
      },
      {
        match: (code: string) => code.includes('@media'),
        response: `/* Here's a better responsive design approach */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 1rem;
}

/* Mobile first approach */
.responsive-element {
  width: 100%;
  padding: var(--spacing-unit);
}

/* Tablet */
@media (min-width: 768px) {
  .responsive-element {
    width: 50%;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .responsive-element {
    width: 33.333%;
  }
}

/* Large Desktop */
@media (min-width: 1200px) {
  .responsive-element {
    width: 25%;
  }
}`
      }
    ]
  }
};

function getMockResponse(code: string, language: string): string {
  const languagePatterns = mockResponses[language as keyof typeof mockResponses];
  
  if (!languagePatterns) {
    return `// No suggestions available for ${language}`;
  }

  for (const pattern of languagePatterns.patterns) {
    if (pattern.match(code)) {
      return pattern.response;
    }
  }

  return `// No specific suggestions found for your ${language} code.
// Try adding more code or using different patterns.`;
}

app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend server is working!' });
});

app.get('/api/complete-code-stream', (req, res) => {
  const { code, language } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const response = getMockResponse(code.toString(), language?.toString() || 'javascript');
  
  const lines = response.split('\n');
  
  let lineIndex = 0;
  const interval = setInterval(() => {
    if (lineIndex >= lines.length) {
      clearInterval(interval);
      res.end();
      return;
    }

    res.write(`data: ${JSON.stringify({ content: lines[lineIndex] + '\n' })}\n\n`);
    lineIndex++;
  }, 100); 
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
});