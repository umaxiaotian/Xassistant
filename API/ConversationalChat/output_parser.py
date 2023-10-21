from __future__ import annotations

from typing import Union

from langchain.agents import AgentOutputParser
from ConversationalChat.prompt import FORMAT_INSTRUCTIONS
from langchain.output_parsers.json import parse_json_markdown
from langchain.schema import AgentAction, AgentFinish, OutputParserException
import re
import json

# Define a class that parses output for conversational agents
class ConvoOutputParser(AgentOutputParser):
    """Output parser for the conversational agent."""

    def get_format_instructions(self) -> str:
        """Returns formatting instructions for the given output parser."""
        return FORMAT_INSTRUCTIONS

    def parse(self, text: str) -> Union[AgentAction, AgentFinish]:
        """Attempts to parse the given text into an AgentAction or AgentFinish.

        Raises:
             OutputParserException if parsing fails.
        """
        try:
            print(text)
            #使用ツールの取得
            action, action_input,tool_input = "", {} , ""
            first_line = text.split('\n')[0]
            match = re.search(r'\[(.*?)\]', first_line)
            if match:
                action = match.group(1)
            #ツールへのインプット
            match = re.search(r'```json\n(.*?)\n```', text, re.DOTALL)
            if match:
                tool_input=parse_json_markdown(text)
            # 4行目の「回答内容:」以降のテキストを取得
            keyword = "回答："
            pos = text.find(keyword)
            if pos != -1:
                action_input=(text[pos + len(keyword):])
            else:
                print("ACTIONINPUT該当する部分が見つかりませんでした。")
                #エージェント処理
            if action == "Final Answer":
                return AgentFinish({"output": action_input}, text)
            else:
                return AgentAction(action, tool_input, text)
          
        except Exception as e:
            raise OutputParserException(f"Could not parse LLM output: {text}") from e

    @property
    def _type(self) -> str:
        return "conversational_chat"
