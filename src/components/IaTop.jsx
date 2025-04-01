import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const IaTopPage = ({ onBack }) => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h6">IA TOP - Assistente Virtual</Typography>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <iframe
          title="IA TOP"
          src="https://copilotstudio.microsoft.com/environments/Default-73319f42-8908-4b89-9f8d-558cf4d5d776/bots/cr6a3_iaTtop/webchat?__version__=2"
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none'
          }}
        />
      </Box>
    </Box>
  );
};

export default IaTopPage;