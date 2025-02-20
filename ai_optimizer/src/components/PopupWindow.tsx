import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField 
} from '@mui/material';
import React, { useState } from 'react';
import { ChatMessage } from '../types/types';

interface PopupWindowProps {
    open: boolean;
    onClose: () => void;
    outputText: string;
    onAccept: () => void;
    onRegenerate: (newInstruction: string) => void;
}

const PopupWindow: React.FC<PopupWindowProps> = ({
    open,
    onClose,
    outputText,
    onAccept,
    onRegenerate
}) => {
    const [newInstruction, setNewInstruction] = useState('');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>AI 优化结果</DialogTitle>
            <DialogContent>
                <TextField
                    id="output_text_area"
                    multiline
                    rows={10}
                    fullWidth
                    variant="outlined"
                    value={outputText}
                    InputProps={{ readOnly: true }}
                    margin="normal"
                />
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
                >
                    重新优化
                </Button>
                <Button 
                    id="accept_btn"
                    onClick={onAccept} 
                    color="primary"
                >
                    接受
                </Button>
                <Button 
                    id="shutdown_btn"
                    onClick={onClose} 
                    color="secondary"
                >
                    关闭
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupWindow;