import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Paper,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';
import { format } from 'date-fns';

const ChatMain = ({ onMenuClick }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);

  // Mock data - replace with actual data from your backend
  const messages = [
    {
      id: 1,
      sender: 'John Doe',
      content: 'Hey everyone! How's it going?',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'Hi! I'm doing great, thanks for asking!',
      timestamp: new Date(Date.now() - 3500000),
      isOwn: true,
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add message sending logic here
      setMessage('');
    }
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Avatar sx={{ mr: 2 }}>G</Avatar>
        <Box>
          <Typography variant="subtitle1">General Chat</Typography>
          <Typography variant="body2" color="text.secondary">
            3 members online
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: msg.isOwn ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                maxWidth: '70%',
              }}
            >
              {!msg.isOwn && (
                <Avatar sx={{ mr: 1 }}>{msg.sender[0]}</Avatar>
              )}
              <Paper
                sx={{
                  p: 2,
                  bgcolor: msg.isOwn ? 'primary.main' : 'background.paper',
                  color: msg.isOwn ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                }}
              >
                {!msg.isOwn && (
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {msg.sender}
                  </Typography>
                )}
                <Typography>{msg.content}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {format(msg.timestamp, 'HH:mm')}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            size="small"
          >
            <EmojiIcon />
          </IconButton>
          <IconButton size="small">
            <AttachFileIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={!message.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
        {showEmojiPicker && (
          <Box
            ref={emojiPickerRef}
            sx={{
              position: 'absolute',
              bottom: '100%',
              right: 0,
              mb: 1,
            }}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatMain; 