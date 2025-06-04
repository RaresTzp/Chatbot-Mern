import { OpenAI } from "openai";


const apiKey = import.meta.env.VITE_OPENAI_PUBLIC_KEY;
console.log(apiKey)
const openai = new OpenAI({apiKey: apiKey, dangerouslyAllowBrowser: true})

export default openai 