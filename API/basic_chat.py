import queue
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.manager import CallbackManager
from dotenv import load_dotenv
import os
from langchain.callbacks.streaming_stdout_final_only import (
    FinalStreamingStdOutCallbackHandler,
)
from langchain.chains import ConversationChain
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory

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

def llm_thread(g, messages, temperature, referenceMode,summaryMode):

    memory = ConversationBufferMemory(human_prefix="User", ai_prefix="Bot", memory_key="history")
    search_me=""
    if summaryMode == "true":
        memory.chat_memory.add_user_message(f"""
            #命令書
            あなたはプロの編集者です。以下の制約条件に従って、入力する文章を要約してください。
            #制約条件
            ・重要なキーワードを取りこぼさない。
            ・文章の意味を変更しない。
            ・架空の表現や言葉を使用しない。
            ・入力する文章を150文字以内にまとめて出力。
            ・要約した文章の句読点を含めた文字数を出力。
            ・文章中の数値には変更を加えない。
            #入力する文章
            {messages[-1]}
            #出力形式
            要約した文章:^\n
            出力した文章の句読点を含めた文字数:
        """
    )
    # messagesリストを処理します
    for message in messages:
        if message['role'] == "assistant":
            memory.chat_memory.add_ai_message(message['content'])
        elif message['role'] == "user":
            memory.chat_memory.add_user_message( message['content'])
        elif message['role'] == "system":
            memory.chat_memory.add_user_message( message['content'])
    # # 最後のメッセージが"user"の役割の場合、search_meにそのメッセージを格納します
    if messages[-1]['role'] == "user":
        search_me = messages[-1]['content']
    else:
        search_me = None  # または適切なデフォルト値
    try:
        chat = ChatOpenAI(
            verbose=True,
            streaming=True,
            callback_manager=CallbackManager([ChainStreamHandler(g)]),
            temperature=temperature,
            openai_api_key=OPENAI_API_KEY,
        )

        chain = ConversationChain(
                        llm=chat, # LLMモデル 
                        # prompt  = prompt_template,  # プロンプトテンプレート
                        verbose = True,             # プロンプトを表示するか否か
                        memory  = memory,           # メモリ
                        )
        chain(search_me)

        
    finally:
        g.close()
