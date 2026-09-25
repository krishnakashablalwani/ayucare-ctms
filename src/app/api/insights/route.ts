import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { vata, pitta, kapha, age, gender, assignedArm } = body;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not set in environment variables." },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert Ayurvedic Clinical Researcher working in an advanced CTMS.
Analyze the following patient profile and provide a concise, 2-3 sentence insight.
Focus on potential adverse events, protocol compliance risks, or efficacy predictions based on their Doshic imbalance.
Keep the tone professional, objective, and strictly medical/clinical.`;

    const userPrompt = `Patient Profile:
- Age: ${age}
- Gender: ${gender}
- Assigned Arm: ${assignedArm}
- Vata: ${vata}%
- Pitta: ${pitta}%
- Kapha: ${kapha}%

Generate a clinical insight.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate AI insight." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const insight = data.choices[0]?.message?.content?.trim();

    return NextResponse.json({ insight });
  } catch (error: any) {
    console.error("Insights API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
