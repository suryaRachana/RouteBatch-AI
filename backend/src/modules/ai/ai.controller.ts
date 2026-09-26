import { Request, Response } from 'express';
import OpenAI from 'openai';

interface TaskSummary {
  name: string;
  address: string;
  priority: string;
  deadline?: string;
  notes?: string;
  completed: boolean;
}

interface RouteAdvicePayload {
  tasks: TaskSummary[];
  optimizedOrder: string[];
  totalDistanceKm: number;
  estimatedTravelTimeMin: number;
  userQuery?: string;
}

export const getRouteAdvice = async (req: Request, res: Response) => {
  try {
    const { tasks, optimizedOrder, totalDistanceKm, estimatedTravelTimeMin, userQuery } = req.body as RouteAdvicePayload;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one task for AI route advice.' });
    }

    const apiKey = process.env.AI_API_KEY;

    // Build context prompt
    const pendingTasks = tasks.filter(t => !t.completed);
    const highPriorityTasks = pendingTasks.filter(t => t.priority.toLowerCase() === 'high');
    const deadlineTasks = pendingTasks.filter(t => t.deadline);

    const taskDetailsStr = pendingTasks
      .map((t, idx) => `- [Stop ${idx + 1}] ${t.name} (Address: ${t.address}, Priority: ${t.priority}${t.deadline ? `, Deadline: ${t.deadline}` : ''}${t.notes ? `, Notes: ${t.notes}` : ''})`)
      .join('\n');

    const promptText = `
You are the AI Route & Operations Field Assistant for field workers.
Here is the current operational task schedule:
Total Pending Stops: ${pendingTasks.length}
Optimized Order: ${optimizedOrder && optimizedOrder.length > 0 ? optimizedOrder.join(' -> ') : 'Default sequence'}
Total Route Distance: ${totalDistanceKm.toFixed(1)} km
Estimated Travel Time: ${Math.round(estimatedTravelTimeMin)} min

Pending Tasks Detail:
${taskDetailsStr}

User Query/Context: "${userQuery || 'How should I optimize and prioritize my route today?'}"

Provide concise, highly actionable field advice in markdown format with 3 distinct sections:
1. 🎯 **Key Priority & Deadline Callouts**: Highlight high-priority tasks and urgent deadlines.
2. 🗺️ **Route Efficiency Strategy**: Explain why the current order is efficient or flag any geographic / traffic timing risks.
3. 💡 **Field Worker Action Plan**: Give 2-3 tactical recommendations for completing these field stops seamlessly today.
`;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_openai_api_key_here') {
      try {
        const openai = new OpenAI({ apiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI logistics dispatch advisor for field service workers.',
            },
            {
              role: 'user',
              content: promptText,
            },
          ],
          temperature: 0.7,
          max_tokens: 600,
        });

        const advice = completion.choices[0]?.message?.content || 'No recommendation returned from AI model.';
        return res.json({ advice, source: 'openai' });
      } catch (openAiErr: any) {
        console.warn('OpenAI API call failed, falling back to internal AI dispatch engine:', openAiErr?.message);
      }
    }

    // Smart fallback recommendation engine if OpenAI API key is missing or fails
    const fallbackAdvice = generateStructuredFallbackAdvice(pendingTasks, highPriorityTasks, deadlineTasks, totalDistanceKm, estimatedTravelTimeMin);

    return res.json({
      advice: fallbackAdvice,
      source: 'fallback_engine',
    });
  } catch (error: any) {
    console.error('AI Route Advice error:', error);
    return res.status(500).json({ error: 'Internal server error while generating route advice.' });
  }
};

function generateStructuredFallbackAdvice(
  pendingTasks: TaskSummary[],
  highPriorityTasks: TaskSummary[],
  deadlineTasks: TaskSummary[],
  distanceKm: number,
  timeMin: number
): string {
  const highPriorityNames = highPriorityTasks.map(t => t.name).join(', ') || 'None specified';
  const deadlineDetails = deadlineTasks.map(t => `${t.name} (by ${t.deadline})`).join(', ') || 'No fixed deadlines';

  return `### 🎯 Key Priority & Deadline Callouts
- **High-Priority Focus**: ${highPriorityTasks.length > 0 ? `Prioritize **${highPriorityNames}** first or ensure early completion to maintain operational SLA.` : 'All stops are standard/medium priority. Maintain current sequence.'}
- **Time-Sensitive Deadlines**: ${deadlineTasks.length > 0 ? `Watch out for specific time constraints: **${deadlineDetails}**.` : 'No rigid deadline constraints detected.'}

### 🗺️ Route Efficiency Strategy
- **Route Summary**: ${pendingTasks.length} stop(s) spanning **${distanceKm.toFixed(1)} km** with ~**${Math.round(timeMin)} mins** total estimated drive time.
- **Geographic Cluster**: The route has been sequenced using Nearest-Neighbor distance optimization to minimize backtracking and fuel consumption.

### 💡 Field Worker Action Plan
1. **Pre-trip Verification**: Confirm contact details or gate codes for **${pendingTasks[0]?.name || 'the first stop'}** before departure.
2. **Buffer Time**: Allow 10-15 minutes buffer between consecutive high-density urban stops for parking and client sign-off.
3. **Midday Checkpoint**: Re-check task completion status halfway through the route to dynamically adjust for unexpected delays.`;
}
