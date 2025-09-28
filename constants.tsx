import type { Tool } from './types';
import {
  CodeIcon,
  CreativeWritingIcon,
  SummarizeIcon,
  TranslateIcon,
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
} from './components/icons';

export const TOOLS: Tool[] = [
  // --- Creative Tools ---
  {
    id: 'image-generator',
    title: 'Image Generator',
    description: 'Create a high-quality image from a text description.',
    icon: ImageIcon,
    category: 'Creative Tools',
    outputType: 'image',
    promptTemplate: '{{CONTEXT}}',
  },
  {
    id: 'video-generator',
    title: 'Video Generator',
    description: 'Generate a short video clip from a text description.',
    icon: VideoIcon,
    category: 'Creative Tools',
    outputType: 'video',
    promptTemplate: '{{CONTEXT}}',
  },
  // --- Planning ---
  {
    id: 'lesson-plan-generator',
    title: 'Lesson Plan Generator',
    description: 'Generate a comprehensive lesson plan for any subject and grade level.',
    icon: BookOpenIcon,
    category: 'Planning',
    outputType: 'text',
    promptTemplate: `Generate a detailed lesson plan based on the following topic.
    
    TOPIC/OBJECTIVE:
    """
    {{CONTEXT}}
    """

    The lesson plan should include:
    - Learning Objectives
    - Materials Needed
    - Step-by-step Procedure (including warm-up, instruction, guided practice, and independent practice)
    - Assessment/Check for Understanding
    - Differentiation for diverse learners.

    LESSON PLAN:
    `,
  },
  {
    id: 'unit-plan-generator',
    title: 'Unit Plan Generator',
    description: 'Create a multi-day unit plan outline for a subject or topic.',
    icon: CalendarDaysIcon,
    category: 'Planning',
    outputType: 'text',
    promptTemplate: `Create a comprehensive unit plan outline for the following topic. The plan should span several days or weeks.

    UNIT TOPIC:
    """
    {{CONTEXT}}
    """

    The unit plan should include:
    - Overall unit goals and essential questions.
    - A sequence of daily lesson topics or objectives.
    - Key activities and assessments for the unit.
    - A culminating project or summative assessment.

    UNIT PLAN OUTLINE:
    `,
  },
  {
    id: 'rubric-generator',
    title: 'Rubric Generator',
    description: 'Create a detailed rubric for any assignment, project, or assessment.',
    icon: TableCellsIcon,
    category: 'Planning',
    outputType: 'text',
    promptTemplate: `Generate a detailed rubric for the following assignment.
    
    ASSIGNMENT DETAILS:
    """
    {{CONTEXT}}
    """

    The rubric should include specific criteria for evaluation and clear descriptions for multiple performance levels (e.g., Exemplary, Proficient, Developing, Beginning).
    
    RUBRIC:
    `,
  },
   {
    id: 'syllabus-generator',
    title: 'Syllabus Generator',
    description: 'Quickly draft a course syllabus with all necessary components.',
    icon: DocumentTextIcon,
    category: 'Planning',
    outputType: 'text',
    promptTemplate: `Generate a course syllabus based on the following information.

    COURSE INFORMATION (Title, grade level, subject, key topics):
    """
    {{CONTEXT}}
    """

    The syllabus should include:
    - Course Description
    - Learning Objectives
    - Required Materials
    - Grading Policy
    - Classroom Rules/Expectations
    - A brief course outline/schedule.

    SYLLABUS:
    `,
  },
  {
    id: 'iep-generator',
    title: 'IEP Goal Generator',
    description: 'Draft measurable and specific goals for an Individualized Education Program.',
    icon: UserGroupIcon,
    category: 'Planning',
    outputType: 'text',
    promptTemplate: `Based on the student's needs described below, generate 3-5 measurable annual goals for an Individualized Education Program (IEP).

    STUDENT'S AREA OF NEED (e.g., reading comprehension, math calculation, social skills):
    """
    {{CONTEXT}}
    """

    For each goal, make it SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

    IEP GOALS:
    `,
  },
  // --- Content ---
  {
    id: 'youtube-summarizer',
    title: 'YouTube Summarizer',
    description: 'Summarize a YouTube video and generate key questions from its transcript.',
    icon: YouTubeIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `The following is a transcript from a YouTube video. Please perform the following tasks:
    1. Provide a concise summary of the video's main points.
    2. Generate a list of 5-7 critical thinking questions based on the video's content.

    VIDEO TRANSCRIPT:
    """
    {{CONTEXT}}
    """

    SUMMARY AND QUESTIONS:
    `,
  },
  {
    id: 'text-leveler',
    title: 'Text Leveler',
    description: 'Adjust the reading level of a text for different grade levels.',
    icon: Bars3BottomLeftIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Rewrite the following text to be appropriate for a {{GRADE_LEVEL}} reading level. Maintain the core meaning and key information.

    ORIGINAL TEXT:
    """
    {{CONTEXT}}
    """

    REWRITTEN TEXT FOR {{GRADE_LEVEL}}:
    `,
  },
  {
    id: 'vocabulary-generator',
    title: 'Vocabulary List Generator',
    description: 'Create a vocabulary list with definitions from a text or topic.',
    icon: BookmarkSquareIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Generate a list of key vocabulary words from the text provided below. For each word, provide a student-friendly definition and an example sentence.

    TEXT:
    """
    {{CONTEXT}}
    """

    VOCABULARY LIST:
    `,
  },
  {
    id: 'multiple-choice-quiz',
    title: 'Multiple Choice Quiz',
    description: 'Generate a multiple-choice quiz based on a text or topic.',
    icon: QuestionMarkCircleIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Generate a {{NUM_QUESTIONS}} question multiple-choice quiz based on the following text. Include an answer key at the end.

    TEXT/TOPIC:
    """
    {{CONTEXT}}
    """

    QUIZ:
    `,
  },
   {
    id: 'proofreader',
    title: 'Proofreader',
    description: 'Correct spelling and grammar mistakes in a piece of text.',
    icon: CheckCircleIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Please proofread the following text for spelling and grammar errors. Provide a corrected version.

    ORIGINAL TEXT:
    """
    {{CONTEXT}}
    """

    CORRECTED TEXT:
    `,
  },
   {
    id: 'jokes-generator',
    title: 'Classroom Jokes',
    description: 'Generate fun, school-appropriate jokes for your students.',
    icon: FaceSmileIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Generate 5 school-appropriate jokes related to the following topic.

    TOPIC:
    """
    {{CONTEXT}}
    """

    JOKES:
    `,
  },
  // --- Student Support ---
  {
    id: 'student-feedback',
    title: 'Student Work Feedback',
    description: 'Provide constructive and encouraging feedback on student writing.',
    icon: ChatBubbleLeftRightIcon,
    category: 'Student Support',
    outputType: 'text',
    promptTemplate: `Act as a supportive teacher. Provide constructive feedback on the following piece of student work. The feedback should be encouraging and specific. Identify at least one key strength and one area for improvement, and offer a concrete suggestion for the student to try.

    STUDENT WORK:
    """
    {{CONTEXT}}
    """

    FEEDBACK:
    `,
  },
  {
    id: 'concept-explainer',
    title: 'Concept Explainer',
    description: 'Explain a complex concept to students in a simple, easy-to-understand way.',
    icon: SparklesIcon,
    category: 'Student Support',
    outputType: 'text',
    promptTemplate: `Explain the following concept to a student as if they are learning it for the first time. Use an analogy or a real-world example to help make it clear.

    CONCEPT:
    """
    {{CONTEXT}}
    """

    EXPLANATION:
    `,
  },
  {
    id: 'behavior-interventions',
    title: 'Behavior Interventions',
    description: 'Suggest positive and restorative interventions for classroom behaviors.',
    icon: LightBulbIcon,
    category: 'Student Support',
    outputType: 'text',
    promptTemplate: `A student in my class is exhibiting the following behavior. Please suggest 3-5 positive, restorative, and supportive intervention strategies a teacher could try.

    BEHAVIOR:
    """
    {{CONTEXT}}
    """

    INTERVENTION STRATEGIES:
    `,
  },
  // --- Communication ---
  {
    id: 'class-newsletter',
    title: 'Class Newsletter',
    description: 'Draft a newsletter to keep parents and guardians informed.',
    icon: NewspaperIcon,
    category: 'Communication',
    outputType: 'text',
    promptTemplate: `Generate a friendly and professional class newsletter for parents.
    
    KEY INFORMATION TO INCLUDE (e.g., upcoming events, topics we're studying, reminders):
    """
    {{CONTEXT}}
    """

    The newsletter should have a warm opening, clear sections for the key information, and a positive closing.

    NEWSLETTER:
    `,
  },
  {
    id: 'email-to-parents',
    title: 'Email to Parents',
    description: 'Compose a professional and clear email to a student\'s parent or guardian.',
    icon: EnvelopeIcon,
    category: 'Communication',
    outputType: 'text',
    promptTemplate: `Draft a professional email to a parent/guardian about the following topic. Be clear, concise, and maintain a positive or neutral tone.

    REASON FOR EMAIL:
    """
    {{CONTEXT}}
    """
    
    EMAIL:
    `,
  },
  {
    id: 'letter-of-recommendation',
    title: 'Letter of Recommendation',
    description: 'Write a strong letter of recommendation for a student.',
    icon: AcademicCapIcon,
    category: 'Communication',
    outputType: 'text',
    promptTemplate: `Write a compelling letter of recommendation for a student.

    STUDENT NAME: {{STUDENT_NAME}}
    APPLYING FOR: {{RECOMMENDATION_RECIPIENT}}
    
    KEY QUALITIES, SKILLS, AND ANECDOTES TO INCLUDE:
    """
    {{CONTEXT}}
    """

    LETTER OF RECOMMENDATION:
    `,
  },
  // Original Tools
  {
    id: 'summarize',
    title: 'Summarize Text',
    description:
      'Condense any text into a concise summary. Paste text or upload a file.',
    icon: SummarizeIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Summarize the following text into the most important key points.
    
    TEXT:
    """
    {{CONTEXT}}
    """

    SUMMARY:
    `,
  },
  {
    id: 'translate',
    title: 'Translate Language',
    description:
      'Translate text from one language to another. Specify the target language.',
    icon: TranslateIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Translate the following text into {{TARGET_LANGUAGE}}.

    TEXT:
    """
    {{CONTEXT}}
    """
    
    TRANSLATION:
    `,
  },
  {
    id: 'code-explainer',
    title: 'Explain Code',
    description: 'Get a clear explanation of what a piece of code does.',
    icon: CodeIcon,
    category: 'Content',
    outputType: 'text',
    promptTemplate: `Explain the following code snippet, what it does, and how it works.

    CODE:
    \`\`\`
    {{CONTEXT}}
    \`\`\`

    EXPLANATION:
    `,
  },
];
