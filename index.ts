import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
const cors = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", {headers:cors});
  if (req.method !== "POST") return new Response(JSON.stringify({error:"Use POST."}), {status:405,headers:{...cors,"Content-Type":"application/json"}});
  try {
    const apiKey = Deno.env.get("GROQ_API_KEY");
    if (!apiKey) return new Response(JSON.stringify({error:"Server is missing GROQ_API_KEY. Add it to Supabase Edge Function secrets."}), {status:503,headers:{...cors,"Content-Type":"application/json"}});
    const body = await req.json();
    const image = body?.image;
    if (typeof image !== "string" || !/^data:image\/(jpeg|jpg|png|webp);base64,/.test(image)) throw new Error("Send a JPEG, PNG, or WebP image as a data URL.");
    if (image.length > 7_000_000) throw new Error("Image is too large. Choose a smaller photo.");
    const prompt = `You are a food-photo estimation assistant. Identify visible foods and estimate a plausible serving size. Return ONLY valid JSON with this shape: {"foods":[{"name":"...","serving":"...","calories":0,"protein":0,"carbs":0,"fat":0,"fiber":0}]}. Numeric values must be nonnegative numbers. If uncertain, use cautious estimates. Do not infer a person's identity, age, health, body, or dietary needs. Never recommend restriction, weight loss, calorie limits, or medical treatment. State no extra text.`;
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {method:"POST",headers:{"Authorization":`Bearer ${apiKey}`,"Content-Type":"application/json"},body:JSON.stringify({model:Deno.env.get("GROQ_VISION_MODEL") || "qwen/qwen3.8-27b",temperature:0.2,max_completion_tokens:900,response_format:{type:"json_object"},messages:[{role:"user",content:[{type:"text",text:prompt},{type:"image_url",image_url:{url:image}}]}]})});
    const raw = await upstream.json();
    if (!upstream.ok) return new Response(JSON.stringify({error:raw?.error?.message || "AI provider request failed."}), {status:502,headers:{...cors,"Content-Type":"application/json"}});
    const content = raw?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content || "{}");
    const foods = Array.isArray(parsed.foods) ? parsed.foods.slice(0,12).map((f:any)=>({name:String(f.name||"Food").slice(0,100),serving:String(f.serving||"Estimated serving").slice(0,100),calories:Math.max(0,Number(f.calories)||0),protein:Math.max(0,Number(f.protein)||0),carbs:Math.max(0,Number(f.carbs)||0),fat:Math.max(0,Number(f.fat)||0),fiber:Math.max(0,Number(f.fiber)||0)})) : [];
    return new Response(JSON.stringify({foods,disclaimer:"Photo-based nutrition values are rough estimates. Review before logging."}), {headers:{...cors,"Content-Type":"application/json"}});
  } catch (e) { return new Response(JSON.stringify({error:e instanceof Error?e.message:"Unexpected server error."}), {status:400,headers:{...cors,"Content-Type":"application/json"}}); }
});
