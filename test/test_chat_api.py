import requests
import json
import sseclient

def test_normal_chat():
    """测试普通对话接口"""
    url = "http://10.192.21.180:5000/chat"
    data = {
        "prompt": "1+1等于几?",
        "history": [],
        "model": "deepseek-r1",
        "stream": False
    }
    
    print("\n=== 测试普通对话 ===")
    print("请求:", json.dumps(data, ensure_ascii=False, indent=2))
    
    response = requests.post(url, json=data)
    if response.status_code == 200:
        result = response.json()
        print("\n思考过程:")
        print(result.get('reasoning', ''))
        print("\n回复内容:")
        print(result.get('content', ''))
    else:
        print(f"错误: {response.status_code}", response.text)

def test_stream_chat():
    """测试流式对话接口"""
    url = "http://10.192.21.180:5000/chat"
    data = {
        "prompt": "2+2等于几?",
        "history": [],
        "model": "deepseek-r1",
        "stream": True
    }
    
    print("\n=== 测试流式对话 ===")
    print("请求:", json.dumps(data, ensure_ascii=False, indent=2))
    
    response = requests.post(url, json=data, stream=True)
    client = sseclient.SSEClient(response)
    
    print("\n接收流式响应:")
    for event in client.events():
        chunk = json.loads(event.data)
        if chunk['is_reasoning']:
            print("\n思考过程:", end='', flush=True)
            print(chunk['content'], end='', flush=True)
        else:
            print("\n回复内容:", end='', flush=True)
            print(chunk['content'], end='', flush=True)
    print("\n")

def test_chat_with_history():
    """测试带历史记录的对话"""
    url = "http://10.192.21.180:5000/chat"
    history = [
        ("1+1等于几?", "1+1等于2"),
        ("2+2等于几?", "2+2等于4")
    ]
    data = {
        "prompt": "那么3+3等于几?",
        "history": history,
        "model": "deepseek-r1",
        "stream": False
    }
    
    print("\n=== 测试带历史记录的对话 ===")
    print("历史记录:")
    for user_msg, ai_msg in history:
        print(f"用户: {user_msg}")
        print(f"AI: {ai_msg}\n")
    
    print("当前问题:", data['prompt'])
    
    response = requests.post(url, json=data)
    if response.status_code == 200:
        result = response.json()
        print("\n思考过程:")
        print(result.get('reasoning', ''))
        print("\n回复内容:")
        print(result.get('content', ''))
    else:
        print(f"错误: {response.status_code}", response.text)

def test_stream_chat_with_history():
    """测试带历史记录的流式对话"""
    url = "http://10.192.21.180:5000/chat"
    history = [
        ("1+1等于几?", "1+1等于2"),
        ("2+2等于几?", "2+2等于4")
    ]
    data = {
        "prompt": "那么4+4等于几?",
        "history": history,
        "model": "deepseek-r1",
        "stream": True
    }
    
    print("\n=== 测试带历史记录的流式对话 ===")
    print("历史记录:")
    for user_msg, ai_msg in history:
        print(f"用户: {user_msg}")
        print(f"AI: {ai_msg}\n")
    
    print("当前问题:", data['prompt'])
    
    response = requests.post(url, json=data, stream=True)
    client = sseclient.SSEClient(response)
    
    for event in client.events():
        chunk = json.loads(event.data)
        if chunk['is_reasoning']:
            print("\n思考过程:", end='', flush=True)
            print(chunk['content'], end='', flush=True)
        else:
            print("\n回复内容:", end='', flush=True)
            print(chunk['content'], end='', flush=True)
    print("\n")

def test_server_connection():
    """测试服务器连接"""
    url = "http://10.192.21.180:5000/test"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print("服务器连接正常！")
            return True
        else:
            print(f"服务器返回错误状态码: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("无法连接到服务器，请确保服务器已启动")
        return False

if __name__ == "__main__":
    print("开始测试聊天接口...")
    print("正在检查服务器连接...")
    
    if not test_server_connection():
        print("服务器连接测试失败，退出测试")
        exit(1)
    
    try:
        test_normal_chat()
        test_stream_chat()
        test_chat_with_history()
        test_stream_chat_with_history()
        
        print("\n所有测试完成!")
    except Exception as e:
        print(f"\n测试过程中出现错误: {str(e)}") 