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

    const handleOptimize = async (prompt: string, history: ChatMessage[] = []) => {
        try {
            const response = await axios.post('http://localhost:5000/chat', {
                prompt,
                history,
                model: 'deepseek-r1',
                stream: false
            });

            const result = response.data.content;
            setOutputText(result);

            // 更新聊天历史
            setChatHistory([
                ...history,
                { role: 'user', content: prompt },
                { role: 'assistant', content: result }
            ]);
        } catch (error) {
            console.error('优化请求失败:', error);
            setOutputText('发生错误，请稍后重试');
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
