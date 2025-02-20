import os
from openai import OpenAI

os.environ["DASHSCOPE_API_KEY"] = "sk-554f8fe85ea74332b8902dd351831e15"


def get_client():
    """初始化并返回 OpenAI 客户端"""
    return OpenAI(
        api_key=os.getenv("DASHSCOPE_API_KEY"),
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1"
    )

def format_messages(prompt, history):
    """
    格式化消息历史
    Args:
        prompt: 当前用户输入
        history: 历史对话记录 list[tuple(user_input, ai_response)]
    Returns:
        list: OpenAI 消息格式
    """
    messages = []
    for user_input, ai_response in history:
        messages.append({"role": "user", "content": user_input})
        messages.append({"role": "assistant", "content": ai_response})
    messages.append({"role": "user", "content": prompt})
    return messages

def chat_completion(prompt, history=None, model="deepseek-r1"):
    """
    非流式对话函数
    Args:
        prompt: 用户输入
        history: 历史对话记录
        model: 模型名称
    Returns:
        dict: 包含思考过程和回复内容的字典
    """
    history = history or []
    messages = format_messages(prompt, history)
    client = get_client()
    completion = client.chat.completions.create(
        model=model,
        messages=messages
    )
    
    return {
        'reasoning': completion.choices[0].message.reasoning_content,
        'content': completion.choices[0].message.content
    }

def chat_completion_stream(prompt, history=None, model="deepseek-r1"):
    """
    流式对话函数
    Args:
        prompt: 用户输入
        history: 历史对话记录
        model: 模型名称
    Yields:
        tuple: (is_reasoning, content) 其中 is_reasoning 表示是否为思考过程，content 为内容
    """
    history = history or []
    messages = format_messages(prompt, history)
    client = get_client()
    completion = client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True
    )

    for chunk in completion:
        if not chunk.choices:
            continue
            
        delta = chunk.choices[0].delta
        
        if hasattr(delta, 'reasoning_content') and delta.reasoning_content is not None:
            yield True, delta.reasoning_content
        elif hasattr(delta, 'content') and delta.content is not None:
            yield False, delta.content

# 使用示例
if __name__ == "__main__":

    model="deepseek-r1"
    # model="deepseek-v3"
    
    # 1. 非流式对话示例
    prompt = "3和4哪个大"
    response = chat_completion(prompt,model=model)
    print("="*20 + "非流式对话" + "="*20)
    print("思考过程：")
    print(response['reasoning'])
    print("回复内容：")
    print(response['content'])
    
    # 2. 流式对话示例
    print("\n" + "="*20 + "流式对话" + "="*20)
    prompt = "9.9和9.11哪个大"
    print("思考过程：")
    is_answering = False
    for is_reasoning, content in chat_completion_stream(prompt, model=model):
        if is_reasoning:
            print(content, end='', flush=True)
        else:
            if not is_answering:
                print("\n回复内容：")
                is_answering = True
            print(content, end='', flush=True)
    print("\n")

    # 3. 带历史记录的对话示例
    print("\n" + "="*20 + "带历史记录的对话" + "="*20)
    history = [
        ("你好", "你好！很高兴见到你。"),
        ("你是谁", "我是一个AI助手，可以帮助回答你的问题。")
    ]
    prompt = "你能做什么"
    response = chat_completion(prompt, history, model=model)
    print("思考过程：")
    print(response['reasoning'])
    print("回复内容：")
    print(response['content'])
    
    # 4. 带历史记录的流式对话示例
    print("\n" + "="*20 + "带历史记录的流式对话" + "="*20)
    history = [
        ("1加1等于几", "1加1等于2"),
        ("2加2等于几", "2加2等于4")
    ]
    prompt = "那4加4等于几"
    print("历史对话：")
    for user_msg, ai_msg in history:
        print(f"用户: {user_msg}")
        print(f"AI: {ai_msg}\n")
    
    print("当前问题：", prompt)
    print("\n思考过程：")
    is_answering = False
    for is_reasoning, content in chat_completion_stream(prompt, history, model=model):
        if is_reasoning:
            print(content, end='', flush=True)
        else:
            if not is_answering:
                print("\n回复内容：")
                is_answering = True
            print(content, end='', flush=True)
    print("\n")