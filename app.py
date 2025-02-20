from flask import Flask, request, Response, jsonify
from utils.llm import chat_completion, chat_completion_stream
import json
from flask_cors import CORS  # 添加CORS支持

app = Flask(__name__)
CORS(app)  # 启用CORS

# 添加一个测试路由
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Server is running!"})

@app.route('/chat', methods=['POST'])  # 确保路由路径是 /chat
def chat():
    data = request.json
    print(f"Received chat request: {data}")  # 添加详细的日志
    prompt = data.get('prompt', '')
    history = data.get('history', [])
    model = data.get('model', 'deepseek-r1')
    stream = data.get('stream', False)
    
    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400
    
    if stream:
        def generate():
            for is_reasoning, content in chat_completion_stream(prompt, history, model):
                chunk = {
                    'is_reasoning': is_reasoning,
                    'content': content
                }
                yield f"data: {json.dumps(chunk)}\n\n"
                
        return Response(generate(), mimetype='text/event-stream')
    else:
        response = chat_completion(prompt, history, model)
        return jsonify(response)

if __name__ == '__main__':
    print("Starting Flask application...")  # 添加启动日志
    app.run(debug=True, host='0.0.0.0', port=5000) 