import { invokeLLM } from "./_core/llm";

/**
 * AI-powered lead analysis for priority detection
 */

interface LeadAnalysisResult {
  priority: number; // 1-5, where 5 is highest
  status: "new" | "urgent";
  aiSummary: string;
}

/**
 * Urgent keywords that indicate high priority
 */
const URGENT_KEYWORDS = [
  'авария',
  'срочно',
  'не работает',
  'простой',
  'утечка',
  'поломка',
  'остановка',
  'критично',
  'немедленно',
  'экстренно',
];

/**
 * Check if text contains urgent keywords
 */
function containsUrgentKeywords(text: string): boolean {
  const lowerText = text.toLowerCase();
  return URGENT_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Analyze lead using AI to determine priority and generate summary
 */
export async function analyzeLead(data: {
  name: string;
  phone: string;
  equipmentType?: string;
  component?: string;
  symptoms?: string;
  comment?: string;
}): Promise<LeadAnalysisResult> {
  try {
    // Combine all text fields for analysis
    const textToAnalyze = [
      data.equipmentType,
      data.component,
      data.symptoms,
      data.comment,
    ]
      .filter(Boolean)
      .join(' ');

    // Quick keyword check first
    const hasUrgentKeywords = containsUrgentKeywords(textToAnalyze);

    // If no text to analyze, return default
    if (!textToAnalyze.trim()) {
      return {
        priority: 3,
        status: "new",
        aiSummary: `Заявка от ${data.name}, телефон: ${data.phone}`,
      };
    }

    // Use AI for detailed analysis
    const prompt = `Проанализируй заявку на ремонт гидравлики спецтехники и определи:
1. Приоритет (1-5, где 5 - самый высокий)
2. Статус (new или urgent)
3. Краткое резюме (1-2 предложения)

Критерии высокого приоритета:
- Аварийная ситуация
- Простой техники
- Утечка масла
- Полная неработоспособность
- Срочная необходимость

Данные заявки:
Тип техники: ${data.equipmentType || 'не указан'}
Узел/компонент: ${data.component || 'не указан'}
Симптомы: ${data.symptoms || 'не указаны'}
Комментарий: ${data.comment || 'нет'}

Ответь в формате JSON:
{
  "priority": число от 1 до 5,
  "status": "new" или "urgent",
  "summary": "краткое резюме"
}`;

    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Ты - эксперт по гидравлическому оборудованию. Анализируй заявки и определяй их приоритет.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "lead_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              priority: {
                type: "integer",
                description: "Priority level from 1 to 5",
              },
              status: {
                type: "string",
                enum: ["new", "urgent"],
                description: "Lead status",
              },
              summary: {
                type: "string",
                description: "Brief summary of the lead",
              },
            },
            required: ["priority", "status", "summary"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0].message.content;
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);
    const result = JSON.parse(contentString || "{}");

    // Override with keyword detection if necessary
    if (hasUrgentKeywords && result.priority < 5) {
      result.priority = 5;
      result.status = "urgent";
    }

    return {
      priority: Math.min(Math.max(result.priority || 3, 1), 5),
      status: result.status === "urgent" ? "urgent" : "new",
      aiSummary: result.summary || `Заявка от ${data.name}`,
    };
  } catch (error) {
    console.error("[Lead Analysis] AI analysis failed:", error);

    // Fallback to keyword-based detection
    const textToAnalyze = [
      data.equipmentType,
      data.component,
      data.symptoms,
      data.comment,
    ]
      .filter(Boolean)
      .join(' ');

    const hasUrgentKeywords = containsUrgentKeywords(textToAnalyze);

    return {
      priority: hasUrgentKeywords ? 5 : 3,
      status: hasUrgentKeywords ? "urgent" : "new",
      aiSummary: `Заявка от ${data.name}${hasUrgentKeywords ? ' (СРОЧНО)' : ''}`,
    };
  }
}
