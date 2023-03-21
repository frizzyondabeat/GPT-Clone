import React, { useState, useEffect } from 'react';
import './App.css';
import { Box, Stack, Typography, FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import { Add, Delete, Message, Person, LightMode, DarkMode, Logout, Send, AccountCircle, Adb } from '@mui/icons-material'
import api from './api/axiosConfig';
import { Typewriter } from 'react-simple-typewriter'


function App() {

  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('gpt-3.5-turbo');

  const clearMessages = () => {
    setChatLog([]);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(e);
    }
  }

  const getEngines = async (e) => {
    const response = await api.get("models");
    const {data} = response;
    setModels(data);
  }

  useEffect(() => {
    getEngines();
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input !== '') {
      let chatLogNew = [...chatLog, { user: "user", message: input }];
      setInput('');
      setChatLog(chatLogNew);
      try{
        const response = await api.post("chat", { 
          prompt: chatLogNew.filter((chat, index, array) => chat.user === "user" && index === array.length -1)[0].message,
          model: currentModel, 
        });
        const {data} = response;
        const message = data[0]?.text ? data[0]?.text : data[0]?.message?.content;
        setChatLog([...chatLogNew, { user: `${data[0]?.message?.role}`, message: `${message}` }]);
      } catch (error) {
        console.log(error);
        return (<div>{error}</div>)
      }
    }
  }

  return (
    <div>
      <Stack direction="row" position='relative' display='flex' justifyContent='space-between' overflow='hidden'>
        <Stack direction="column">
          <Stack direction="column" position='relative' gap={2} sx={{
              width: 'var(--sidebar-width)',
              height: '8vh',
              backgroundColor: 'var(--color-background-sidebar)',
              alignItems: 'center',
              padding: '8px',
              color: 'var(--color-text)',
              zIndex: 20,
            }}>
            <Box sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              fontSize: 14,
              borderRadius: '5px',
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderStyle: 'solid',
              borderWidth: '1px',
              ":hover": {
                backgroundColor: '#2b2c2f',
              },
              cursor: 'pointer',
              zIndex: 100,
              position: 'sticky', 
            }}>
              <Add sx={{
                pr: '7px',
              }} />
              New chat
            </Box>
          </Stack>
          <Stack direction="column" position='relative' gap={2} sx={{
            width: 'var(--sidebar-width)',
            height: '51vh',
            backgroundColor: 'var(--color-background-sidebar)',
            alignItems: 'center',
            padding: '8px',
            color: 'var(--color-text)',
            zIndex: 20,
            overflowY: 'scroll',
            overflowX: 'hidden',
          }}>
            {
              chatLog.filter((chat) => chat.user === 'user').map((chat, index) => (
                <Box key={index} sx={{
                  width: '100%',
                  display: 'flex',
                  border: 'none',
                  fontSize: 14,
                  borderRadius: '5px',
                  color: 'var(--color-text)',
                  alignItems: 'center',
                  padding: '10px',
                  ":hover": {
                    backgroundColor: '#343541',
                  },
                  cursor: 'pointer',
                  textOverflow: 'ellipsis',
                }}>
                  <Message sx={{
                    pr: '7px',
                  }} />
                  {chat?.message}
                </Box>)
              )
            }
          </Stack>
          <Stack direction="column" gap={2} sx={{
            height: '41vh',
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--color-background-sidebar)',
            alignItems: 'center',
            padding: '8px',
            zIndex: 100,
            color: 'var(--color-text)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            bottom: 0,
          }}>
            <FormControl fullWidth sx={{marginTop: 1}}>
              <InputLabel sx={{
                color: 'var(--color-text)',
              }} id="model-label">Model</InputLabel>
              <Select
                labelId="model-label"
                id="model-select"
                value={currentModel}
                label="Model"
                onChange={(e) => {setCurrentModel(e.target.value)}}
                sx={{
                  // background: 'var(--color-subtext)',
                  outlineColor: 'var(--color-text)',
                  color: 'var(--color-text)',
                }}
              >
                {
                  models.map((model, index) => (
                    <MenuItem key={index} value={model?.id}>{model?.id}</MenuItem>
                  ))
                }
                
              </Select>
            </FormControl>
            <Box onClick={clearMessages} sx={{
              width: '100%',
              display: 'flex',
              border: 'none',
              fontSize: 14,
              borderRadius: '5px',
              color: 'var(--color-text)',
              alignItems: 'center',
              padding: '10px',
              ":hover": {
                backgroundColor: 'var(--color-background-body-dark)',
              },
              cursor: 'pointer',
              ":active": {
                transform: 'scale(0.95)',
              }
            }}>
              <Delete sx={{
                pr: '7px',
                ":hover": {
                  color: 'red'
                },
              }} />
              Clear conversations
            </Box>
            <Box sx={{
              width: '100%',
              display: 'flex',
              border: 'none',
              fontSize: 14,
              borderRadius: '5px',
              color: 'var(--color-text)',
              alignItems: 'center',
              padding: '10px',
              ":hover": {
                backgroundColor: 'var(--color-background-body-dark)',
              },
              cursor: 'pointer',
            }}>
              <Person sx={{pr: '7px'}} />
              Upgrade to Premium
            </Box>
            {
              darkMode ? (
                <Box onClick={() => setDarkMode(!darkMode)} sx={{
                  width: '100%',
                  display: 'flex',
                  border: 'none',
                  fontSize: 14,
                  borderRadius: '5px',
                  color: 'var(--color-text)',
                  alignItems: 'center',
                  padding: '10px',
                  ":hover": {
                    backgroundColor: 'var(--color-background-body-dark)',
                  },
                  cursor: 'pointer',
                  ":active": {
                    transform: 'scale(0.95)',
                  }
                }}>
                  <LightMode sx={{
                    pr: '7px',
                    ":hover": {
                      color: 'yellow'
                    }
                  }} />
                  Light Mode
                </Box>
              ) : (
                <Box onClick={() => setDarkMode(!darkMode)} sx={{
                  width: '100%',
                  display: 'flex',
                  border: 'none',
                  fontSize: 14,
                  borderRadius: '5px',
                  color: 'var(--color-text)',
                  alignItems: 'center',
                  padding: '10px',
                  ":hover": {
                    backgroundColor: 'var(--color-background-body-dark)',
                  },
                  cursor: 'pointer',
                  ":active": {
                    transform: 'scale(0.95)',
                  }
                }}>
                  <DarkMode sx={{pr: '7px'}} />
                  Dark Mode
                </Box>
              )
            }
            <Box sx={{
              width: '100%',
              display: 'flex',
              border: 'none',
              fontSize: 14,
              borderRadius: '5px',
              color: 'var(--color-text)',
              alignItems: 'center',
              padding: '10px',
              ":hover": {
                backgroundColor: 'var(--color-background-body-dark)',
              },
              cursor: 'pointer',
            }}>
              <Logout sx={{pr: '7px'}} />
              Logout
            </Box>
          </Stack>
        </Stack>
        
        <Stack direction="column" sx={{
          width: '100%',
          backgroundColor: darkMode ? 'var(--color-background-body-dark)' : 'var(--color-background-body-white)',
          alignItems: 'center',
          color: 'var(--color-text)',
          position: 'relative',
          overflow: 'hidden',
          overflowY: 'scroll',
          maxHeight: '87vh',
        }}>
          {
            chatLog.map((chat, index) => (
              <Box key={index} sx={{
                width: '100%',
                display: 'flex',
                border: 'none',
                fontSize: 14,
                borderRadius: '5px',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 0',
              }}>
                {chat?.user === "user" ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    // color: darkMode ? 'var(--color-text)' : 'black',
                    padding: 10,
                    background: darkMode ? 'var(--color-background-body-dark)' : 'var(--color-background-body-white)',
                  }}>
                    <AccountCircle sx={{
                      // color: darkMode ? 'var(--color-text)' : 'black',
                      color: '#f06e00',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      margin: '0 100px 0 200px',
                    }} />
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      width: '100%',
                      marginRight: '200px',
                      flex: 1
                    }}>
                      <p style={{
                        width: '100%',
                        color: darkMode ? 'var(--color-text)' : 'black',
                        overflowWrap: 'break-word',
                        lineHeight: '1.25rem',
                        fontSize: 16
                        }}
                      >
                        {chat?.message}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: 10,
                    background: darkMode ? '#444654' : 'white',
                    borderTop: '1px solid rgba(0, 0, 0, 0.2)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
                  }}>
                    <Adb sx={{
                      // color: darkMode ? 'var(--color-text)' : 'black',
                      color: '#06F208',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      margin: '0 100px 0 200px',
                    }} />
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      width: '100%',
                      marginRight: '200px',
                      flex: 1
                    }}>
                      <p style={{
                        width: '100%',
                        color: darkMode ? 'var(--color-subtext)' : 'black',
                        overflowWrap: 'break-word',
                        lineHeight: '2rem',
                        fontSize: 16
                        }}
                      >
                        <Typewriter words={[chat?.message]} typeSpeed='30' />
                      </p>
                    </div>
                  </div>
                )}
              </Box>
            ))
          }

          <div style={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            padding: '0 300px',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: darkMode ? 'var(--text-area-bg)' : 'var(--color-background-body-white)',
            zIndex: 39,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              borderRadius: '5px',
              padding: '10px 15px',
              background: darkMode ? '#444654' : 'var(--color-background-body-white)',
              boxShadow: darkMode ? '0px 0px 5px 3px rgba(0, 0, 0, 0.2)' : '0px 0px 5px 3px rgba(0, 0, 0, 0.2)',
            }}>
              <input value={input} onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)} type="text" placeholder='' style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                width: '100%',
                alignItems: 'center',
                color: darkMode ? 'var(--color-text)' : 'black',
                fontSize: 16,
                padding: '0 10px',
              }} />
              <div onClick={sendMessage} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                padding: '10px',
                borderRadius: '5px',
              }}>
                <Send sx={{
                  color: "var(--color-subtext)", 
                  margin: "0 20px",
                  width: "100%",
                  height: "100%",
                }} />
              </div>
            </div>
            <Typography variant="body2" component="div" sx={{ 
              flexGrow: 1,
              pt: 1,
              color: 'var(--color-subtext)',
              marginBottom: '20px',
              fontSize: '12px',
            }}>
              HomeRunner&copy; {
                // Get the current date in the format of DD-MM-YYYY in with the month in words
                new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'long', year: 'numeric'})
              }. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.
            </Typography>
          </div>
        </Stack>
      </Stack>
    </div>
  );
}

export default App;
