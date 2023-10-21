import queue
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.manager import CallbackManager
from dotenv import load_dotenv
import os
from Tools import AnimeRankingTool
from langchain.utilities import GoogleSearchAPIWrapper
from langchain.callbacks.streaming_stdout_final_only import (
    FinalStreamingStdOutCallbackHandler,
)
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)
from langchain.agents import Tool, AgentExecutor
from ConversationalChat import base

load_dotenv()

OPENAI_API_KEY = os.getenv("API_KEY")
GCSE_ID = os.getenv("GCSE_ID")
GAPI_KEY = os.getenv("GAPI_KEY")

class ThreadedGenerator:
    def __init__(self):
        self.queue = queue.Queue()

    def __iter__(self):
        return self

    def __next__(self):
        item = self.queue.get()
        if item is StopIteration:
            raise item
        return item

    def send(self, data):
        self.queue.put(data)

    def close(self):
        self.queue.put(StopIteration)

class ChainStreamHandler(FinalStreamingStdOutCallbackHandler):
    def __init__(self, gen):
        super().__init__()
        self.gen = gen

    def on_llm_new_token(self, token: str, **kwargs):
        self.gen.send(token)

def llm_thread(g, temperature, messages):
    chat_history = [SystemMessage(content="あなたは日本語のアシスタントです。日本語で対応しなさい。")]

    # messagesリストを処理します
    for message in messages:
        if message['role'] == "assistant":
            chat_history.append(AIMessage(content=message['content']))
        elif message['role'] == "user":
            chat_history.append(HumanMessage(content=message['content']))
        elif message['role'] == "system":
            chat_history.append(SystemMessage(content=message['content']))

    # 最後のメッセージが"user"の役割の場合、search_meにそのメッセージを格納します
    if messages[-1]['role'] == "user":
        search_me = HumanMessage(content=messages[-1]['content'])
    else:
        search_me = None  # または適切なデフォルト値
    action_inputlt = {"input": search_me, "chat_history": chat_history}
    try:
        chat = ChatOpenAI(
            verbose=True,
            streaming=True,
            callback_manager=CallbackManager([ChainStreamHandler(g)]),
            temperature=temperature,
            openai_api_key=OPENAI_API_KEY,
        )
        search = GoogleSearchAPIWrapper(
            google_cse_id=GCSE_ID, google_api_key=GAPI_KEY)
        animerank = AnimeRankingTool()
        tools = [
            Tool(
                name="Current Search",
                func=search.run,
                description="Useful if you need to search the web.Please enter the response exactly as is."
            ),
            Tool(
                name="AnimeRankingTool",
                func=animerank._run,
                description=(
                    'Useful if you are looking for anime rankings.'
                    'The input has one key "rank" and contains the ranking of the anime. If no rank is specified, then "rank" will be set to None.'
                )

            ),
        ]
        agent = base.ConversationalChatAgent.from_llm_and_tools(
            llm=chat,
            tools=tools,
        ),
        agent_executor = AgentExecutor.from_agent_and_tools(
            agent=base.ConversationalChatAgent.from_llm_and_tools(
                agent=agent,
                llm=chat,
                tools=tools,
            ),
            tools=tools,
            verbose=True,
            max_iterations=5,
            handle_parsing_errors=True,
        )
        agent_executor.run(action_inputlt)

    finally:
        g.close()
