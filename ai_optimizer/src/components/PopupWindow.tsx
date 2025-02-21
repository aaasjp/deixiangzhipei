import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    TextField,
    Paper
} from '@mui/material';

interface PopupWindowProps {
    open: boolean;
    onClose: () => void;
    outputText: string;
    reasoningText: string;
    onAccept: () => void;
    onRegenerate: (newInstruction: string, originalText: string) => void;
    isStreaming: boolean;
    originalText: string;
}

const PopupWindow: React.FC<PopupWindowProps> = ({
    open,
    onClose,
    outputText,
    reasoningText,
    onAccept,
    onRegenerate,
    isStreaming,
    originalText
}) => {
    const [newInstruction, setNewInstruction] = useState('');

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>优化结果</DialogTitle>
            <DialogContent>
                {reasoningText && (
                    <Typography
                        sx={{
                            mb: 2,
                            color: 'text.secondary',
                            fontSize: '0.9rem',
                            fontStyle: 'italic',
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                            borderRadius: 1
                        }}
                    >
                        {reasoningText}
                    </Typography>
                )}
                <Paper 
                    elevation={0}
                    sx={{
                        padding: 2,
                        backgroundColor: '#ffffff',
                        '& pre': {
                            backgroundColor: '#f5f5f5',
                            padding: 2,
                            borderRadius: 1,
                            overflow: 'auto'
                        },
                        '& code': {
                            backgroundColor: '#f5f5f5',
                            padding: '2px 4px',
                            borderRadius: 1,
                            fontFamily: 'monospace'
                        },
                        '& p': {
                            marginBottom: 1
                        },
                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                            marginTop: 2,
                            marginBottom: 1
                        },
                        '& ul, & ol': {
                            marginLeft: 2
                        },
                        '& blockquote': {
                            borderLeft: '4px solid #e0e0e0',
                            marginLeft: 0,
                            paddingLeft: 2,
                            color: 'text.secondary'
                        }
                    }}
                >
                    <ReactMarkdown>
                        {outputText}
                    </ReactMarkdown>
                </Paper>
                {isStreaming && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
                <TextField
                    id="input_new_instruction"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    placeholder="输入新的优化指令..."
                    margin="normal"
                    sx={{ mt: 3 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    取消
                </Button>
                <Button
                    id="re_generate_btn"
                    onClick={() => {
                        onRegenerate(newInstruction, originalText);
                        setNewInstruction('');
                    }}
                    color="primary"
                    disabled={isStreaming || !newInstruction.trim()}
                >
                    重新生成
                </Button>
                <Button
                    onClick={onAccept}
                    color="primary"
                    variant="contained"
                    disabled={isStreaming}
                >
                    接受
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default PopupWindow;