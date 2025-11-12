import { GoogleGenAI, Modality, Type } from "@google/genai";

// The API key is injected from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export interface SouvenirIdea {
  title: string;
  description: string;
  imageUrl: string;
}

// Helper to extract base64 data from data URL
const getBase64FromDataUrl = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};

// Generates a single image based on a design concept
const generateImageForIdea = async (
  title: string,
  description: string,
  souvenirType: string,
  designSketch?: string
): Promise<string> => {
  const imagePrompt = `Generate a visually appealing 3D render of a '${souvenirType}' souvenir.
The design concept is:
Title: "${title}"
Description: "${description}"
The souvenir should be on a clean, modern, light-colored background. The style should be photorealistic.`;

  const parts: any[] = [{ text: imagePrompt }];

  if (designSketch) {
    const base64Data = getBase64FromDataUrl(designSketch);
    if (base64Data.length > 250) {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: base64Data,
        },
      });
      parts[0].text += "\nIncorporate elements from the provided reference image into the final design.";
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: parts },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
  }
  
  throw new Error(`Image generation failed for "${title}".`);
};

export const generateSouvenirIdeas = async (
  souvenirType: string,
  designDescription: string,
  designSketch?: string
): Promise<SouvenirIdea[]> => {
  // Step 1: Generate 5 text descriptions
  const descriptionPrompt = `You are a creative 3D souvenir designer for '3D Souvenirs Korea'.
A customer wants a custom '${souvenirType}'.
Their design idea is: '${designDescription || 'The customer is open to ideas and wants you to be creative!'}'
${designSketch ? "The customer has also provided a reference image for inspiration." : ""}

Based on this, create FIVE distinct and unique 3D printable design concepts.
For each concept, provide a short, catchy title and an exciting description that infuses Korean culture.
`;
  
  try {
    const descriptionResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: descriptionPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            designs: {
              type: Type.ARRAY,
              description: "An array of 5 unique souvenir design concepts.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'A short, catchy title for the design concept.',
                  },
                  description: {
                    type: Type.STRING,
                    description: 'A short, exciting description of the design, infused with Korean culture.',
                  },
                },
                required: ["title", "description"]
              },
            }
          },
          required: ["designs"]
        },
      },
    });

    const resultJson = JSON.parse(descriptionResponse.text);
    const designConcepts: { title: string, description: string }[] = resultJson.designs;
    
    if (!designConcepts || designConcepts.length === 0) {
        throw new Error("Failed to generate design descriptions.");
    }
    
    // Step 2: Generate an image for each description in parallel
    const imagePromises = designConcepts.map(concept => 
      generateImageForIdea(concept.title, concept.description, souvenirType, designSketch)
    );

    const imageUrls = await Promise.all(imagePromises);

    // Step 3: Combine descriptions and images
    const finalIdeas: SouvenirIdea[] = designConcepts.map((concept, index) => ({
      ...concept,
      imageUrl: imageUrls[index],
    }));
    
    return finalIdeas;

  } catch (error) {
    console.error("Error generating souvenir ideas:", error);
    if (error instanceof Error && error.message.includes("JSON")) {
       throw new Error("Sorry, our AI designer had a creative block and couldn't format the ideas correctly. Please try again!");
    }
    throw new Error("Sorry, we couldn't generate designs at this moment. Our AI might be busy dreaming up other ideas. Please try again!");
  }
};