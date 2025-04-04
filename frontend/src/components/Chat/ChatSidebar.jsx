import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  InputBase,
  Badge,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const ChatSidebar = ({ onClose }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual data from your backend
  const chatRooms = [
    { id: 1, name: 'General Chat', lastMessage: 'Hello everyone!', unread: 3 },
    { id: 2, name: 'Tech Discussion', lastMessage: 'React is awesome!', unread: 0 },
  ];

  const users = [
    { id: 1, name: 'John Doe', status: 'online', lastSeen: '2 min ago' },
    { id: 2, name: 'Jane Smith', status: 'offline', lastSeen: '1 hour ago' },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.paper',
            borderRadius: 1,
            p: '4px 8px',
            flex: 1,
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1 }}
          />
        </Box>
        <IconButton sx={{ ml: 1 }}>
          <AddIcon />
        </IconButton>
        {onClose && (
          <IconButton onClick={onClose} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Chat Rooms
        </Typography>
        <List>
          {chatRooms.map((room) => (
            <ListItem key={room.id} disablePadding>
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar>{room.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={room.name}
                  secondary={room.lastMessage}
                  secondaryTypographyProps={{
                    noWrap: true,
                  }}
                />
                {room.unread > 0 && (
                  <Badge
                    badgeContent={room.unread}
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Online Users
        </Typography>
        <List>
          {users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={user.status === 'online' ? 'success' : 'default'}
                  >
                    <Avatar>{user.name[0]}</Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  secondary={user.status === 'online' ? 'Online' : user.lastSeen}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ChatSidebar; 