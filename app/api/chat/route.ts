/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";

// TODO: Implement this file
export async function POST(request: Request) {
  const { message } = await request.json();

  const response = await generateResponse(message);
  return Response.json({ response })

}
