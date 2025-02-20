import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField 
} from '@mui/material';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types/types';

interface PopupWindowProps {
    open: boolean;
    onClose: () => void;
    outputText: string;
    onAccept: () => void;
    onRegenerate: (newInstruction: string) => void;
    isStreaming?: boolean;
}

const PopupWindow: React.FC<PopupWindowProps> = ({
    open,
    onClose,
    outputText,
    onAccept,
    onRegenerate,
    isStreaming = false
}) => {
    const [newInstruction, setNewInstruction] = useState('');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>AI 优化结果 {isStreaming && '(生成中...)'}</DialogTitle>
            <DialogContent>
                <div style={{ 
                    padding: '16px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: '4px',
                    marginTop: '16px',
                    minHeight: '200px',
                    maxHeight: '400px',
                    overflow: 'auto'
                }}>
                    <ReactMarkdown>{outputText}</ReactMarkdown>
                </div>
                <TextField
                    id="input_new_instruction"
                    fullWidth
                    variant="outlined"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    placeholder="输入新的优化指令..."
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    id="re_generate_btn"
                    onClick={() => {
                        onRegenerate(newInstruction);
                        setNewInstruction('');
                    }}
                    color="primary"
                    disabled={isStreaming}
                >
                    重新优化
                </Button>
                <Button 
                    id="accept_btn"
                    onClick={onAccept} 
                    color="primary"
                    disabled={isStreaming}
                >
                    接受
                </Button>
                <Button 
                    id="shutdown_btn"
                    onClick={onClose} 
                    color="secondary"
                    disabled={isStreaming}
                >
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupWindow;