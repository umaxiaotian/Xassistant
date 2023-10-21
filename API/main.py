from fastapi import FastAPI, HTTPException, Body, Query,Depends
from fastapi.responses import StreamingResponse
import openai
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain.llms import OpenAI
import os
from dotenv import load_dotenv
import threading
import uvicorn
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import tools_function
import basic_chat

load_dotenv()  # .env ファイルから環境変数を読み込み
app = FastAPI(
    title="XAssistant"
)

OPENAI_API_KEY = os.getenv("API_KEY")
openai.api_key = OPENAI_API_KEY

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get("/")
def main():
    return {"content":"WELCOME OBASERVER"}

class QueryParams(BaseModel):
    temperature: str = Query(...)
    referenceMode: str = Query(...)
    summaryMode:str = Query(None) #任意
def generate_stream(messages, temperature, referenceMode,summaryMode):
    g = basic_chat.ThreadedGenerator()
    threading.Thread(target=basic_chat.llm_thread, args=(g,messages, temperature, referenceMode,summaryMode)).start()
    return g
def generateToolTalk(messages, temperature):
    g = tools_function.ThreadedGenerator()
    threading.Thread(target=tools_function.llm_thread, args=(g,temperature,messages)).start()
    return g

@app.post("/generate")
async def generate_prompt(messages: list = Body(...), query: QueryParams = Depends(QueryParams)):
    #標準会話機能
    if query.referenceMode == 'basic':
        # print(query.summaryMode)
        return StreamingResponse(generate_stream(messages, query.temperature, query.referenceMode,query.summaryMode), media_type="text/plain")
    if query.referenceMode == 'tools':
        return StreamingResponse(generateToolTalk(messages, query.temperature),media_type='text/event-stream'
    )
    if query.referenceMode == 'pagescan':
        raise HTTPException(status_code=400, detail='この情報参照モードは工事中です。')
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000,)