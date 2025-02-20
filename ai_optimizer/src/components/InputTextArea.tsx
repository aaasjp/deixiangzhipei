import { TextField } from '@mui/material';
import React from 'react';

interface InputTextAreaProps {
    value: string;
    onChange: (value: string) => void;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({ value, onChange }) => {
    return (
        <TextField
            id="input_text_area"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="请输入需要优化的内容..."
        />
    );
};

export default InputTextArea;