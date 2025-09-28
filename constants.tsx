import type { Tool } from './types';
import {
  BookOpenIcon,
  CalendarDaysIcon,
  TableCellsIcon,
  UserGroupIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  NewspaperIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  Bars3BottomLeftIcon,
  ClipboardDocumentListIcon,
  BookmarkSquareIcon,
  YouTubeIcon,
  ImageIcon,
  VideoIcon,
  TranslateIcon,
  CodeIcon,
  SummarizeIcon,
} from './components/icons';

export const GRADE_LEVELS = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'University'
];


export const TOOLS: Tool[] = [
  // Planning
  {
    id: 'lesson-plan',
    title: 'Lesson Plan Generator',
    description: 'Create a comprehensive lesson plan for any subject and grade level.',
    category: 'Planning',
    icon: BookOpenIcon,
    outputType: 'text',
    showFileUpload: true,
    requiresGradeLevel: true,
    requiresNGSS: true,
    inputs: [
      { id: 'topic', label: 'Lesson Topic', type: 'text', placeholder: 'e.g., "Photosynthesis", "The American Revolution"' },
      { id: 'objectives', label: 'Learning Objectives (optional)', type: 'textarea', placeholder: 'e.g., "Students will be able to explain the process of photosynthesis."' }
    ],
    promptTemplate: (inputs) => {
      let prompt = `As an expert instructional designer, create a detailed lesson plan for a ${inputs.gradeLevel} class on the topic of "${inputs.topic}".`;
      if (inputs.ngssStandard) prompt += ` The lesson plan should be aligned with the following NGSS standard: ${inputs.ngssStandard}.`;
      if (inputs.objectives) prompt += `\n\nThe specific learning objectives are: ${inputs.objectives}.`;
      prompt += `\n\nThe plan should include:
      - A clear and engaging introduction/hook.
      - Direct instruction content.
      - A guided practice activity.
      - An independent practice activity.
      - An assessment method (e.g., exit ticket, quiz).
      - Differentiation strategies for diverse learners.
      - Estimated timings for each section.
      Format the output professionally using markdown.`;
      return prompt;
    },
  },
  {
    id: 'unit-plan',
    title: 'Unit Plan Generator',
    description: 'Design a full unit plan around a central topic, including multiple lesson ideas.',
    category: 'Planning',
    icon: CalendarDaysIcon,
    outputType: 'text',
    showFileUpload: true,
    requiresGradeLevel: true,
    requiresNGSS: true,
    inputs: [
        { id: 'topic', label: 'Unit Topic', type: 'text', placeholder: 'e.g., "Ecosystems", "World War II"' },
        { id: 'duration', label: 'Unit Duration', type: 'text', placeholder: 'e.g., "3 weeks", "5 class periods"' }
    ],
    promptTemplate: (inputs) => `As an expert curriculum developer, generate a comprehensive unit plan for a ${inputs.gradeLevel} class covering the topic "${inputs.topic}" over a duration of ${inputs.duration}.
    ${inputs.ngssStandard ? `The unit must be aligned with NGSS standard: ${inputs.ngssStandard}.` : ''}
    The plan should include:
    - Overarching unit goals and essential questions.
    - A sequence of 5-7 lesson titles with brief descriptions.
    - Key vocabulary terms.
    - Project-based learning or summative assessment ideas.
    - Necessary materials and resources.
    Format the output professionally using markdown tables where appropriate.`
  },
  {
    id: 'rubric-generator',
    title: 'Rubric Generator',
    description: 'Quickly create a detailed rubric for any assignment or project.',
    category: 'Planning',
    icon: TableCellsIcon,
    outputType: 'text',
    showFileUpload: false,
    requiresGradeLevel: true,
    inputs: [
        { id: 'assignment', label: 'Assignment/Project Title', type: 'text', placeholder: 'e.g., "Persuasive Essay", "Science Fair Project"' },
        { id: 'criteria', label: 'Key Criteria (comma-separated)', type: 'textarea', placeholder: 'e.g., "Clarity, Evidence, Grammar, Organization"' }
    ],
    promptTemplate: (inputs) => `Create a detailed 4-level rubric (e.g., Exemplary, Proficient, Developing, Beginning) for a ${inputs.gradeLevel} assignment titled "${inputs.assignment}".
    The rubric should assess the following criteria: ${inputs.criteria}.
    For each criterion, provide clear, descriptive text for each performance level.
    Present the output as a markdown table.`
  },
  // Content
  {
    id: 'concept-explainer',
    title: 'Concept Explainer',
    description: 'Explain complex topics in a simple, easy-to-understand way.',
    category: 'Content',
    icon: LightBulbIcon,
    outputType: 'text',
    showFileUpload: false,
    requiresGradeLevel: true,
    inputs: [
        { id: 'concept', label: 'Concept to Explain', type: 'text', placeholder: 'e.g., "Black Holes", "Supply and Demand"' }
    ],
    promptTemplate: (inputs) => `Explain the concept of "${inputs.concept}" as if you were speaking to a ${inputs.gradeLevel} student. Use analogies and simple language. Break it down into key points.`
  },
  {
    id: 'youtube-summarizer',
    title: 'YouTube Video Summarizer',
    description: 'Provide a YouTube video transcript to get a summary and key questions.',
    category: 'Content',
    icon: YouTubeIcon,
    outputType: 'text',
    showFileUpload: true,
    requiresGradeLevel: false,
    inputs: [
        { id: 'transcript', label: 'Paste Video Transcript Here', type: 'textarea', placeholder: 'Provide the full text transcript of the video...' }
    ],
    promptTemplate: (inputs) => `Based on the following YouTube video transcript, please provide:
    1. A concise summary of the video's main points.
    2. A list of 3-5 critical thinking questions a teacher could ask students after watching.
    3. A list of key vocabulary terms mentioned.
    
    Transcript:
    ---
    ${inputs.transcript}`
  },
   {
    id: 'text-leveler',
    title: 'Text Leveler',
    description: 'Adjust the reading level of a text to make it more or less complex.',
    category: 'Content',
    icon: Bars3BottomLeftIcon,
    outputType: 'text',
    showFileUpload: true,
    requiresGradeLevel: true,
    inputs: [
        { id: 'text', label: 'Original Text', type: 'textarea', placeholder: 'Paste the text you want to level here...' }
    ],
    promptTemplate: (inputs) => `Rewrite the following text to be appropriate for a ${inputs.gradeLevel} reading level. Maintain the core message and information.
    
    Original Text:
    ---
    ${inputs.text}`
  },
  {
    id: 'summarize-text',
    title: 'Summarize Text',
    description: 'Condense any text into a concise summary.',
    category: 'Content',
    icon: SummarizeIcon,
    outputType: 'text',
    showFileUpload: true,
    inputs: [
      { id: 'textToSummarize', label: 'Text to Summarize', type: 'textarea', placeholder: 'Paste the text you want to summarize here...' },
    ],
    promptTemplate: (inputs, context) => `Please provide a concise summary of the following text:\n\n---\n\n${inputs.textToSummarize || context}`,
  },
  {
    id: 'translate-text',
    title: 'Translate Text',
    description: 'Translate text to a different language.',
    category: 'Content',
    icon: TranslateIcon,
    outputType: 'text',
    showFileUpload: true,
    inputs: [
      { id: 'textToTranslate', label: 'Text to Translate', type: 'textarea', placeholder: 'Enter the text to translate...' },
      { id: 'targetLanguage', label: 'Translate To', type: 'select', options: ['Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic', 'Russian'] },
    ],
    promptTemplate: (inputs, context) => `Translate the following text into ${inputs.targetLanguage}. Only provide the translated text as the output.\n\n---\n\n${inputs.textToTranslate || context}`,
  },
  // Student Support
  {
    id: 'quiz-generator',
    title: 'Multiple Choice Quiz',
    description: 'Generate a multiple-choice quiz based on a topic or provided text.',
    category: 'Student Support',
    icon: QuestionMarkCircleIcon,
    outputType: 'text',
    showFileUpload: true,
    requiresGradeLevel: true,
    inputs: [
        { id: 'topic', label: 'Quiz Topic', type: 'text', placeholder: 'e.g., "The Solar System", "Shakespeare\'s Macbeth"' },
        { id: 'questions', label: 'Number of Questions', type: 'select', options: ['5', '10', '15', '20'] }
    ],
    promptTemplate: (inputs, context) => `Generate a ${inputs.questions}-question multiple-choice quiz for ${inputs.gradeLevel} students on the topic of "${inputs.topic}".
    ${context ? `Base the quiz on the following context:\n${context}` : ''}
    For each question, provide 4 answer choices with one clear correct answer.
    After all the questions, provide a separate answer key.`
  },
  {
    id: 'feedback-generator',
    title: 'Student Work Feedback',
    description: 'Provide constructive and actionable feedback on student writing.',
    category: 'Student Support',
    icon: CheckCircleIcon,
    outputType: 'text',
    showFileUpload: true,
    inputs: [
        { id: 'assignment', label: 'Assignment Context', type: 'text', placeholder: 'e.g., "5th Grade book report on \'Charlotte\'s Web\'"' },
        { id: 'studentWork', label: 'Student Writing', type: 'textarea', placeholder: 'Paste the student\'s work here...' }
    ],
    promptTemplate: (inputs) => `Act as a supportive teacher providing feedback on a student's work. The assignment was: ${inputs.assignment}.
    Provide feedback on the following student writing. Structure your feedback with:
    1. "Glows": Two specific things the student did well.
    2. "Grows": Two specific, actionable suggestions for improvement.
    Maintain a positive and encouraging tone.

    Student's Work:
    ---
    ${inputs.studentWork}`
  },
  {
    id: 'iep-goals',
    title: 'IEP Goal Generator',
    description: 'Draft SMART goals for an Individualized Education Program.',
    category: 'Student Support',
    icon: BookmarkSquareIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
        { id: 'area', label: 'Area of Need', type: 'text', placeholder: 'e.g., "Reading Comprehension", "Social Skills"' },
        { id: 'currentLevel', label: 'Student\'s Current Performance Level', type: 'textarea', placeholder: 'e.g., "Reads at a 2nd-grade level, struggles with multi-syllable words."' }
    ],
    promptTemplate: (inputs) => `Generate three distinct, measurable SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals for an IEP.
    - Area of Need: ${inputs.area}
    - Student's Current Performance: ${inputs.currentLevel}
    Format the goals clearly.`
  },
  // Communication
  {
    id: 'class-newsletter',
    title: 'Class Newsletter',
    description: 'Generate a professional newsletter to keep parents and guardians informed.',
    category: 'Communication',
    icon: NewspaperIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
        { id: 'topics', label: 'Key Topics for this Week', type: 'textarea', placeholder: 'e.g., "Math: Started fractions. Reading: \'The Giver\'. Science: Frog dissection."' },
        { id: 'events', label: 'Upcoming Dates/Events', type: 'textarea', placeholder: 'e.g., "Picture Day on Friday. Parent-Teacher conferences next week."' }
    ],
    promptTemplate: (inputs) => `Write a friendly and professional classroom newsletter for parents.
    - Start with a warm opening.
    - Create a "What We're Learning" section summarizing these topics: ${inputs.topics}.
    - Create a "Dates to Remember" section for these events: ${inputs.events}.
    - End with a positive closing statement.
    Format it with clear headings using markdown.`
  },
  {
    id: 'report-card-comments',
    title: 'Report Card Comments',
    description: 'Generate thoughtful and personalized report card comments.',
    category: 'Communication',
    icon: ClipboardDocumentListIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
        { id: 'studentName', label: 'Student Name', type: 'text', placeholder: 'e.g., "Alex"' },
        { id: 'strengths', label: 'Strengths', type: 'textarea', placeholder: 'e.g., "Excellent participant in class discussions, creative problem solver."' },
        { id: 'challenges', label: 'Areas for Growth', type: 'textarea', placeholder: 'e.g., "Struggles with organization, needs to show work in math."' }
    ],
    promptTemplate: (inputs) => `Generate a report card comment for a student named ${inputs.studentName}.
    The comment should be constructive and supportive, starting with their strengths and then addressing areas for growth with actionable advice.
    - Strengths: ${inputs.strengths}
    - Areas for Growth: ${inputs.challenges}
    Combine these points into a concise, professional paragraph of 3-4 sentences.`
  },
  {
    id: 'recommendation-letter',
    title: 'Letter of Recommendation',
    description: 'Write a strong letter of recommendation for a student.',
    category: 'Communication',
    icon: AcademicCapIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
        { id: 'studentName', label: 'Student Name', type: 'text', placeholder: 'e.g., "Jordan"' },
        { id: 'recipient', label: 'For (e.g., Scholarship, University)', type: 'text', placeholder: 'e.g., "the National Honor Society", "New York University"' },
        { id: 'qualities', label: 'Key Qualities & Achievements', type: 'textarea', placeholder: 'e.g., "Led the robotics club, top of the class in physics, demonstrates strong leadership..."' }
    ],
    promptTemplate: (inputs) => `Write a formal and compelling letter of recommendation for a student named ${inputs.studentName}.
    - The letter is for: ${inputs.recipient}.
    - Highlight these key qualities and achievements: ${inputs.qualities}.
    Structure the letter with a clear introduction, a body paragraph providing specific examples of their qualities, and a strong concluding statement.
    Sign off as "A Concerned Educator".`
  },
  // Productivity
  {
    id: 'email-responder',
    title: 'Email Responder',
    description: 'Draft a professional reply to any email.',
    category: 'Productivity',
    icon: EnvelopeIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
      { id: 'originalEmail', label: 'Email to Reply To', type: 'textarea', placeholder: 'Paste the email from the parent, admin, or colleague here...' },
      { id: 'mainPoints', label: 'Key Points for Your Reply', type: 'textarea', placeholder: 'e.g., "Agree to the meeting. Suggest Thursday. Ask about the agenda."' }
    ],
    promptTemplate: (inputs) => `Draft a professional and polite email response based on the provided information.
    
    Original Email:
    ---
    ${inputs.originalEmail}
    ---
    
    My Key Points for the Reply:
    ---
    ${inputs.mainPoints}
    ---
    
    Generate a complete email draft, including a suitable greeting and closing.`
  },
  {
    id: 'code-explainer',
    title: 'Code Explainer',
    description: 'Explain a snippet of code in simple terms.',
    category: 'Productivity',
    icon: CodeIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
      { id: 'codeSnippet', label: 'Code Snippet', type: 'textarea', placeholder: 'Paste code here...' },
      { id: 'language', label: 'Programming Language', type: 'text', placeholder: 'e.g., Python, JavaScript' },
    ],
    promptTemplate: (inputs) => `Explain the following ${inputs.language} code snippet line-by-line, as if you were explaining it to a beginner.
    
    Code:
    \`\`\`${inputs.language.toLowerCase()}
    ${inputs.codeSnippet}
    \`\`\`
    `
  },
  {
    id: 'joke-generator',
    title: 'Classroom Joke Generator',
    description: 'A fun tool to generate classroom-appropriate jokes!',
    category: 'Productivity',
    icon: FaceSmileIcon,
    outputType: 'text',
    showFileUpload: false,
    inputs: [
      { id: 'topic', label: 'Joke Topic', type: 'text', placeholder: 'e.g., "Math", "History", "Science"' }
    ],
    promptTemplate: (inputs) => `Tell me a classroom-appropriate joke about ${inputs.topic}.`
  },
  // Media
  {
    id: 'image-generator',
    title: 'Image Generator',
    description: 'Create unique images from text descriptions.',
    category: 'Media',
    icon: ImageIcon,
    outputType: 'image',
    showFileUpload: false,
    inputs: [
      {
        id: 'imagePrompt',
        label: 'Image Prompt',
        type: 'text',
        placeholder: 'e.g., "A photo of an astronaut riding a horse on Mars."',
      },
    ],
    promptTemplate: (inputs) => inputs.imagePrompt,
  },
  {
    id: 'video-generator',
    title: 'Video Generator',
    description: 'Create short video clips from text descriptions.',
    category: 'Media',
    icon: VideoIcon,
    outputType: 'video',
    showFileUpload: false,
    inputs: [
      {
        id: 'videoPrompt',
        label: 'Video Prompt',
        type: 'text',
        placeholder: 'e.g., "A cinematic shot of a futuristic city at night."',
      },
    ],
    promptTemplate: (inputs) => inputs.videoPrompt,
  },
];
