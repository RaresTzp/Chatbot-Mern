import Upload from '../upload/upload';
import { IKImage } from 'imagekitio-react';
import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import openai from '../../lib/openai';
import Markdown from "react-markdown"

const NewPrompt = () => {
    const [assistant, setAssistant] = useState(null);
    const [thread, setThread] = useState(null);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [img, setImg] = useState ({
        isLoading: false,
        error: "",
        dbData: {},
    })

    const endRef = useRef(null);

    useEffect(() => {
        const initialize = async () => {
          try {
            // Create an Assistant (with or without special instructions, tools, etc.)
            const newAssistant = await openai.beta.assistants.create({
              name: "Vision Assistant",
              instructions: "You are a helpful assistant with image understanding.",
              model: "gpt-4o", // includes built-in vision
            });
            setAssistant(newAssistant);
    
            // Create a fresh Thread for this conversation
            const newThread = await openai.beta.threads.create();
            setThread(newThread);
          } catch (error) {
            console.error("Error creating assistant/thread:", error);
          }
        };
    
        initialize();
      }, []);

    useEffect(() => {
        endRef.current.scrollIntoView({behaviour: "smooth"});
    }, [question, answer, img.dbData]); 
      
    const add = async (text) => {
        setQuestion(text);
        if (!assistant || !thread) {
            console.warn("Assistant/Thread not ready yet.");
            return;
          }
    
        // Construct the content array for the user message
        // We always have text:
        const contentArray = [
          {
            type: "text",
            text: text,
          },
        ];
    
        // If we have an uploaded ImageKit file path, append the "image_url"
        if (img.dbData.filePath) {
          const finalImageUrl = `https://ik.imagekit.io/zoy8itb2r${img.dbData.filePath}`;
          contentArray.push({
            type: "image_url",
            image_url: {
              url: finalImageUrl,
            },
          });
        }
    
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: contentArray,
          });
    
          // Clear any old streaming text
          setAnswer("");
    
          // 4) Stream the assistant's response in real time
          openai.beta.threads.runs
            .stream(thread.id, { assistant_id: assistant.id })
            .on("textCreated", (initialText) => {
              // The first chunk of text from the assistant
              setAnswer(initialText);
            })
            .on("textDelta", (delta, snapshot) => {
              // Subsequent partial tokens
              setAnswer((prev) => prev + delta.value);
            })
            .on("end", () => {
              // Streaming finished
              console.log("Streaming complete.");
            })
            .on("error", (err) => {
              console.error("Streaming error:", err);
            });
    
          // Reset user input & image state
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
          });
      };
const handleSubmit = async (e) => {

    e.preventDefault()

    const text = e.target.text.value;
    if(!text) return;

    add(text)

   

}
    return (
        <>
        {/*ADD NEW CHAT */}
        {img.isLoading && <div className=''>Loading...</div>}
        {img.dbData?.filePath && (
            <IKImage
            urlEndpoint="https://ik.imagekit.io/zoy8itb2r"
            path={img.dbData?.filePath}
            width="380"
            transformation={[{width: 380}]} //used to optimize original file size to load faster
          />
        )}
       {question && <div className='message user'>{question}</div>}
       {answer && <div className='message'><Markdown>{answer}</Markdown></div>}
        <div className='endChat' ref={endRef}></div>
            <form className='newForm' onSubmit={handleSubmit}>
                <Upload setImg={setImg}/>
                <input id='file' type='file' multiple={false} hidden/>
                <input type='text' name="text" placeholder='Ask anything...'/>
                <button>
                    <img src='/arrow.png' alt=''/>
                </button>
            </form>
        </>
    )
}

export default NewPrompt;