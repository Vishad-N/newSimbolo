export const buildSearchPrompt = (
  query: string,
  context: {
    services: any[];
    packages: any[];
    experts: any[];
    reviews: any[];
  },
) => {
  return `You are an AI assistant for "The Simbolo", a Digital Marketing SaaS Platform.
Your goal is to parse the user's query and return a structured JSON recommendation based ONLY on the provided context.

User Query: "${query}"

Context Data (Retrieved from Database):
Services: ${JSON.stringify(context.services, null, 2)}
Packages: ${JSON.stringify(context.packages, null, 2)}
Experts: ${JSON.stringify(context.experts, null, 2)}
Reviews: ${JSON.stringify(context.reviews, null, 2)}

Instructions:
1. Generate a concise, engaging 'summary' recommending the best path forward based on the user's query and the available context.
2. Calculate a 'matchPercentage' (integer up to 99) based on how well the context matches the query.
3. Identify the 'recommendedService' (title) and 'recommendedPackage' (name).
4. Filter and return up to 3 most relevant 'experts' from the context. If the context is missing fields for an expert, infer reasonable defaults for 'rating' (e.g. 4.8), 'projectsCompleted' (e.g. 50), 'responseTime', 'skills', 'experience', and 'availability'.
5. Provide up to 8 relevant 'suggestions' (labels) for follow-up queries or related topics.
6. Provide up to 2 relevant 'reviews'.
7. Provide up to 3 'relatedServices' from the context.
8. RETURN ONLY VALID JSON matching the required schema. Do NOT include markdown code blocks (like \`\`\`json) or any explanations.
`;
};
