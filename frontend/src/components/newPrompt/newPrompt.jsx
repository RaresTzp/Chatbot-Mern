import Upload from '../upload/upload';
import { IKImage } from 'imagekitio-react';
import './newPrompt.css'
import { useEffect, useRef, useState } from 'react';
import { createAssistant, createThread, streamRun } from '../../lib/langgraph';
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
            const newAssistant = await createAssistant();
            setAssistant(newAssistant);

            const newThread = await createThread();
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
    
        // Clear any old streaming text
        setAnswer("");

        // Stream assistant response using LangGraph API
        await streamRun(
          thread.id,
          assistant.id,
          { content: contentArray },
          (token) => {
            setAnswer((prev) => prev + token);
          }
        );
    
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