import React, { useState } from 'react';
import { 
    Button, 
    Container, 
    Box, 
    Typography, 
    Paper,
    CircularProgress
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
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
    const [reasoningText, setReasoningText] = useState('');
    const [finalText, setFinalText] = useState('');

    const handleOptimize = async (prompt: string, history: ChatMessage[] = [], originalText?: string) => {
        try {
            setIsStreaming(true);
            setReasoningText('');
            setFinalText('');
            
            // 构建完整的历史记录
            const fullHistory = originalText 
                ? [...history, 
                    { role: 'user', content: originalText },
                    { role: 'assistant', content: finalText }
                  ]
                : history;

            const response = await fetch('http://localhost:5000/optimize_course_scense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    history: fullHistory,  // 使用完整的历史记录
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
                if (done) {
                    // 在流式响应完成后更新历史记录
                    updateChatHistoryAfterResponse(prompt, finalText);
                    break;
                }
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.is_reasoning) {    
                                setReasoningText(prev => prev + (data.content || ''));
                            } else {
                                setFinalText(prev => prev + (data.content || ''));
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE data:', e);
                        }
                    }
                }
            }

            // 更新聊天历史
            setChatHistory(prev => [
                ...fullHistory,  // 使用完整的历史记录
                { role: 'user', content: prompt }
                // 等待新的响应完成后再添加 assistant 的回复
            ]);
        } catch (error) {
            console.error('优化请求失败:', error);
            setFinalText('发生错误，请稍后重试');
        } finally {
            setIsStreaming(false);
        }
    };

    // 在流式响应完成后更新历史记录
    const updateChatHistoryAfterResponse = (prompt: string, response: string) => {
        setChatHistory(prev => [
            ...prev,
            { role: 'assistant', content: response }
        ]);
    };

    const handleAccept = () => {
        setInputText(finalText);
        setIsPopupOpen(false);
    };

    const handleRegenerate = (newInstruction: string, originalText: string) => {
        handleOptimize(newInstruction, chatHistory, originalText);
    };

    return (
        <Container maxWidth="lg">
            <Box 
                sx={{ 
                    mt: 4, 
                    mb: 6,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main',
                        textAlign: 'center',
                        mb: 4
                    }}
                >
                    AI 文本优化助手
                </Typography>

                <Paper 
                    elevation={3}
                    sx={{
                        width: '100%',
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: 'background.paper'
                    }}
                >
                    <InputTextArea
                        value={inputText}
                        onChange={setInputText}
                    />
                    
                    <Box 
                        sx={{ 
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'center'
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={isStreaming ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                            onClick={() => {
                                setIsPopupOpen(true);
                                handleOptimize(inputText);
                            }}
                            disabled={isStreaming || !inputText.trim()}
                            sx={{
                                minWidth: 200,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1.1rem',
                                boxShadow: 2,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    transition: 'transform 0.2s',
                                    boxShadow: 3,
                                }
                            }}
                        >
                            {isStreaming ? '优化中...' : 'AI 优化'}
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <PopupWindow
                open={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                outputText={finalText}
                reasoningText={reasoningText}
                onAccept={handleAccept}
                onRegenerate={handleRegenerate}
                isStreaming={isStreaming}
                originalText={inputText}
            />
        </Container>
    );
}

export default App;
