import React from 'react';
import { LinearProgress } from '@mui/material';

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
    return (
         <LinearProgress
            variant='determinate'
            value={value}
            sx={{
                height: 8,
                borderRadius: 5,
                marginBottom: 3,
                backgroundColor: '#374151',
                '& .MuiLinearProgress-bar': {
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    borderRadius: 5, 
                    backgroundColor: 'white', 
                }
            }}
        />
    );
}

export default ProgressBar;