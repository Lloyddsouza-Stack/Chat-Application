import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatMain from './ChatMain';

const ChatLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: isMobile ? (isSidebarOpen ? '100%' : 0) : 320,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          borderRight: '1px solid',
          borderColor: 'divider',
          display: isMobile && !isSidebarOpen ? 'none' : 'block',
        }}
      >
        <ChatSidebar onClose={isMobile ? toggleSidebar : undefined} />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: isMobile && isSidebarOpen ? 0 : '100%',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <ChatMain onMenuClick={toggleSidebar} />
      </Box>
    </Box>
  );
};

export default ChatLayout; 