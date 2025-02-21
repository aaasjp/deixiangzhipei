import { TextField, Paper, Typography } from '@mui/material';
import React from 'react';

interface InputTextAreaProps {
    value: string;
    onChange: (value: string) => void;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({ value, onChange }) => {
    return (
        <div>
            <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                    mb: 2 
                }}
            >
                请输入需要优化的内容
            </Typography>
            <TextField
                id="input_text_area"
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="在这里输入你想要优化的文本内容..."
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: '#fafafa',
                        '&:hover': {
                            backgroundColor: '#ffffff',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#ffffff',
                        }
                    }
                }}
            />
        </div>
    );
};

export default InputTextArea;