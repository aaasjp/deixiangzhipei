import React, { useState } from 'react';
import { Button, Container, Box } from '@mui/material';
import InputTextArea from './components/InputTextArea';
import PopupWindow from './components/PopupWindow';
import { ChatMessage } from './types/types';
import axios from 'axios';

function App() {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const handleOptimize = async (prompt: string, history: ChatMessage[] = []) => {
        try {
            setIsStreaming(true);
            setOutputText('');
            
            const response = await fetch('http://localhost:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    history,
                    model: 'deepseek-r1',
                    stream: true
                })
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('Failed to get reader from response');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            setOutputText(prev => prev + (data.content || ''));
                        } catch (e) {
                            console.warn('Failed to parse SSE data:', e);
                        }
                    }
                }
            }

            // 更新聊天历史
            setChatHistory(prev => [
                ...history,
                { role: 'user', content: prompt },
                { role: 'assistant', content: outputText }
            ]);
        } catch (error) {
            console.error('优化请求失败:', error);
            setOutputText('发生错误，请稍后重试');
        } finally {
            setIsStreaming(false);
        }
    };

    const handleAccept = () => {
        setInputText(outputText);
        setIsPopupOpen(false);
    };

    const handleRegenerate = (newInstruction: string) => {
        handleOptimize(newInstruction, chatHistory);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 2 }}>
                <InputTextArea
                    value={inputText}
                    onChange={setInputText}
                />
            </Box>
            
            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setIsPopupOpen(true);
                    handleOptimize(inputText);
                }}
            >
                AI优化
            </Button>

            <PopupWindow
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                outputText={outputText}
                onAccept={handleAccept}
                onRegenerate={handleRegenerate}
            />
        </Container>
    );
}

export default App;
