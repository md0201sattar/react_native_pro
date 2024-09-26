import React, {useState, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Image, Text} from 'react-native';
import {GiftedChat, Send, Bubble} from 'react-native-gifted-chat';
import axios from 'axios';
import {Icon} from 'react-native-elements';
import * as DocumentPicker from 'react-native-document-picker';
import InChatFileTransfer from './InChatFileTranfer';
import InChatViewFile from './InChatViewFile';
import {TwilioService} from '../utils/twilio-service';
import {ChatLoader} from './ChatLoader';
import Colors from '../utils/Colors';
import {getUserDetailsSync} from '../utils/getUserDetailsSync';

export default function ChatWithAgent({agentData, userData, token}) {
  const {agent_ID, agent_title, first_name, last_name, agent_email} = agentData;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const chatClientChannel = useRef();
  const chatMessagesPaginator = useRef();
  const [userDetails, setUserDetails] = useState(userData);
  const [channels, setChannels] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [blockChatBtn, setBlockChatBtn] = useState(false);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [fileVisible, setFileVisible] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [twilioToken, setTwilioToken] = useState(token);

  const fetchFCMData = async userDetails => {
    var myHeaders = new Headers();
    myHeaders.append('security_key', 'SurfLokal52');
    myHeaders.append('access_token', userDetails?.authToken);
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };
    console.log('fetchFCMData requestOptions', requestOptions);
    await fetch(
      `https://surf-lokal-middleware.vercel.app/webapi/v1/twilio/chat/show.php?userId=${agent_email}`,
      requestOptions,
    )
      .then(chatResult => chatResult.json())
      .then(async chatResult => {
        console.log('fetchFCMData chatResult', chatResult);
        setTokens(chatResult?.data[0]?.token);
      })
      .catch(error => {
        console.log('fetchFCMData twilio/chat/show error', error);
      });
  };

  async function getToken(userData) {
    const requestAddress = 'https://meet.surflokal.com/getChatToken';
    if (!requestAddress) {
      throw new Error(
        'REACT_APP_ACCESS_TOKEN_SERVICE_URL is not configured, cannot login',
      );
    }
    try {
      const response = await axios.get(requestAddress, {
        params: {
          emailAddress: userData
            ? userData.user_email.toLowerCase()
            : userDetails.user_email.toLowerCase(),
          auth_token: userData ? userData.authToken : userDetails.authToken,
        },
      });
      setTwilioToken(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error(error.response.data ?? 'Authentication error.');
      }
      console.error(`ERROR received from ${requestAddress}: ${error}\n`);
      throw new Error(`ERROR received from ${requestAddress}: ${error}\n`);
    }
  }

  const onAddChannel = channel => {
    const newChannel = TwilioService.getInstance().parseChannel(channel);
    setChannels(channels.concat(newChannel));
    TwilioService.getInstance()
      .getChatClient()
      .then(client => client.getChannelBySid(newChannel.id))
      .then(channel => setChannelEvents(channel))
      .then(currentChannel => currentChannel.getMessages())
      .then(async paginator => {
        if (!paginator || !paginator.items) return;
        const messageHistory = [];
        for (let index = 0; index < paginator.items.length; index++) {
          const message = paginator.items[index];
          if (
            message.state.attributes.image ||
            message?.state?.attributes?.file
          ) {
            const imageURL = await fetchImageURL(
              `https://mcs.us1.twilio.com/v1/Services/IS0e9abcc3c0ce428aaa62f05fb14de044/Media/${message?.state?.media?.sid}`,
              twilioToken,
            );
            messageHistory.push({
              sid: message?.sid,
              text: message?.state?.attributes?.text,
              createdAt: message?.dateCreated,
              image: imageURL,
              ...(message?.state?.attributes?.file && {
                file: {
                  url: imageURL,
                  fileName: message?.state?.attributes?.file?.fileName,
                },
              }),
              user: {
                _id: message?.state?.author,
                name: message?.state?.author,
              },
              received: true,
            });
          } else {
            messageHistory.push({
              sid: message?.sid,
              text: message?.body,
              createdAt: message?.dateCreated,
              image: '',
              user: {
                _id: message?.author,
                name: message?.author,
              },
              received: true,
            });
          }
        }
        chatMessagesPaginator.current = paginator;
        const newMessages =
          TwilioService.getInstance().parseMessages(messageHistory);
        setMessages(newMessages);
      })
      .catch(err =>
        console.log(
          '🚀 ~ file: ChatWithAgent.js:138 ~ onAddChannel ~ err.message:',
          err.message,
        ),
      )
      .finally(() => setLoading(false));
  };

  const createChannelAndJoin = channelName => {
    setLoading(true);
    TwilioService.getInstance()
      .getChatClient()
      .then(client =>
        client
          .getChannelByUniqueName(channelName)
          .then(channel =>
            channel.channelState.status !== 'joined' ? channel.join() : channel,
          )
          .then(onAddChannel)
          .then(currentChannel => {
            // Add agent as a participant
            TwilioService.getInstance().addParticipant(
              channel.sid,
              agent_email,
            );
            currentChannel.getMessages();
          })
          .catch(() =>
            client
              .createChannel({
                uniqueName: channelName,
                friendlyName: channelName,
                isPrivate: true,
              })
              .then(async channel => {
                // Add agent as a participant
                await TwilioService.getInstance().addParticipant(
                  channel.sid,
                  agent_email,
                );
                onAddChannel(channel);
                channel.join();
              }),
          ),
      )
      .then(
        () =>
          __DEV__ &&
          console.log(
            "🚀 ~ file: ChatWithAgent.js:184 ~ createChannelAndJoin ~ 'You have joined.':",
            'You have joined.',
          ),
      );
    // .catch(
    //   err =>
    //     __DEV__ &&
    //     console.log(
    //       '🚀 ~ file: ChatWithAgent.js:190 ~ createChannelAndJoin ~ err.message:',
    //       err.message,
    //     ),
    // );
    // .finally(() => setLoading(false));
  };

  const getSubscribedChannels = useCallback(
    client =>
      client.getSubscribedChannels().then(paginator => {
        if (!channelPaginator || !channelPaginator.current) return;
        channelPaginator.current = paginator;
        const newChannels = TwilioService.getInstance().parseChannels(
          channelPaginator.current.items,
        );
        setChannels(newChannels);
      }),
    [setChannels],
  );

  useEffect(() => {
    if (!agent_ID) return;
    const fetchUserDetailsAndToken = async () => {
      const userDetails = await getUserDetailsSync();
      setUserDetails(userDetails);
      fetchFCMData(userDetails);
      getToken(userDetails)
        .then(token => TwilioService.getInstance().getChatClient(token))
        .then(() => TwilioService.getInstance().addTokenListener(getToken))
        // .then(setChannelEvents)
        .then(getSubscribedChannels)
        .catch(err =>
          console.log(
            '🚀 ~ file: ChatWithAgent.js:190 ~ createChannelAndJoin ~ err.message:',
            err.message,
          ),
        )
        .finally(() => {
          createChannelAndJoin(`${userDetails?.user_email}--${agent_email}`);
        });
    };
    fetchUserDetailsAndToken();
    return () => TwilioService.getInstance().clientShutdown();
  }, [setUserDetails, getSubscribedChannels]);

  async function fetchImageURL(imageUrl, token) {
    if (!imageUrl) {
      return '';
    }
    const url = imageUrl;
    try {
      const response = await axios.get(url, {
        headers: {
          'X-Twilio-Token': token,
        },
      });

      return response.data.links.content_direct_temporary;
    } catch (error) {
      // console.error('Error fetching image URL:', error.message);
      return null;
    }
  }

  //API call to send txt msg =>{also img,file data}
  const setChannelEvents = useCallback(channel => {
    chatClientChannel.current = channel;
    chatClientChannel.current.on('messageAdded', async message => {
      let newMessage;

      if (message.state.attributes.image || message?.state?.attributes?.file) {
        const imageURL = await fetchImageURL(
          `https://mcs.us1.twilio.com/v1/Services/IS0e9abcc3c0ce428aaa62f05fb14de044/Media/${message?.state?.media?.sid}`,
          twilioToken,
        );
        newMessage = {
          sid: message.sid,
          text: message?.state?.attributes?.text,
          createdAt: message?.dateCreated,
          image: imageURL,
          ...(message?.state?.attributes?.file && {
            file: {
              url: imageURL,
              fileName: message?.state?.attributes?.file?.fileName,
            },
          }),
          user: {
            _id: message?.author,
            name: message?.author,
          },
          received: true,
        };
      } else {
        newMessage = {
          sid: message.sid,
          text: message.body,
          createdAt: message.dateCreated,
          image: '',
          user: {
            _id: message.author,
            name: message.author,
          },
          received: true,
        };
      }

      const {sid} = message;
      if (sid) {
        setMessages(prevMessages => {
          if (prevMessages.some(({_id}) => _id === sid)) {
            return prevMessages.map(m => (m._id === sid ? newMessage : m));
          } else {
            // Add the new message only if it doesn't exist
            setBlockChatBtn(false);
            return [newMessage, ...prevMessages];
          }
        });
      }
    });

    return chatClientChannel.current;
  }, []);

  // add a function attach file using DocumentPicker.pick
  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      console.log(fileUri);
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };

  const sendMessageToFCM = async (text, receiveTokens, fileUrl = '') => {
    try {
      var myHeaders = new Headers();
      myHeaders.append('security_key', 'SurfLokal52');
      myHeaders.append('access_token', userDetails?.authToken);
      myHeaders.append('Content-Type', 'application/json');

      // TITLE used to display name in web notification
      var raw = JSON.stringify({
        // title: fileUrl ? 'Media' : '',
        title: userDetails?.nickname,
        body: fileUrl ? fileUrl : text,
        fcmTokens: receiveTokens,
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      return fetch(
        'https://surf-lokal-middleware.vercel.app/firebase/notification',
        requestOptions,
      )
        .then(response => {
          console.log(
            'Notification API => Server Response Status:',
            response.status,
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        })
        .catch(error => {
          console.error('firebase/notification Error:', error);
        });
    } catch (error) {
      __DEV__ && console.error('Error sending message to FCM', error);
    }
  };

  const uploadFileToTwilio = async (fileUri, mimeType) => {
    const fileName = fileUri.split('/').pop();
    const formData = new FormData();
    const file = {
      uri: fileUri,
      type: mimeType,
      name: fileName,
    };

    formData.append('file', file);

    try {
      const twilioToken = await getToken();
      const response = await axios.post(
        'https://mcs.us1.twilio.com/v1/Services/IS0e9abcc3c0ce428aaa62f05fb14de044/Media?Category=media',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Twilio-Token': twilioToken,
          },
        },
      );

      return response.data.url;
    } catch (error) {
      console.error('Error uploading file to Twilio:', error);
      throw error;
    }
  };

  const sendFileMessage = async (fileUrl, text, imageUrl, isFile) => {
    const fileName = fileUrl.split('/').pop();
    const fileExtension = fileUrl.split('.').pop().toLowerCase();
    const messageData = {
      _id: Date.now().toString(),
      text,
      createdAt: new Date(),
      user: {
        _id: userDetails?.user_email?.toLowerCase(),
      },
      image: !isFile ? imageUrl : '',
      ...(isFile && {
        file: {
          url: imageUrl,
          fileName: fileName,
        },
      }),
    };

    try {
      let contentType;
      let formData = new FormData();

      switch (fileExtension) {
        case 'pdf':
          contentType = 'application/pdf';
          break;
        case 'png':
          contentType = 'image/png';
          break;
        case 'jpg':
        case 'jpeg':
          contentType = 'image/jpeg';
          break;
        default:
          // Default to binary data if the file type is not recognized
          contentType = 'application/octet-stream';
      }

      // Add the file to the FormData object
      formData.append('file', {
        uri: fileUrl,
        name: fileName,
        type: contentType,
      });

      formData.append('filename', fileName);
      formData.append('contentType', contentType);
      const messageIndex = await chatClientChannel.current.sendMessage(
        formData,
        messageData,
      );
      console.log('Message sent successfully. Index:', messageIndex);
    } catch (error) {
      console.error('Error sending file message to Twilio:', error);
    }
  };

  const onSend = useCallback(
    async (messages = [], tokens) => {
      const [messageToSend] = messages;
      try {
        if (isAttachImage) {
          // Handle image attachment
          const imageUrl = await uploadFileToTwilio(imagePath, 'image/jpeg');
          await sendFileMessage(imagePath, messageToSend.text, imageUrl, false);
          sendMessageToFCM(messageToSend.text, tokens, imageUrl);
        } else if (isAttachFile) {
          // Handle file attachment
          const fileUrl = await uploadFileToTwilio(filePath, 'application/pdf');
          await sendFileMessage(filePath, messageToSend.text, fileUrl, true);
          sendMessageToFCM(messageToSend.text, tokens, fileUrl);
        } else {
          await chatClientChannel?.current?.sendMessage(messageToSend.text);
          await sendMessageToFCM(messageToSend.text, tokens);
        }
      } catch (error) {
        console.error('Error sending file:', error);
      } finally {
        // Reset attachment state
        setIsAttachImage(false);
        setIsAttachFile(false);
        setImagePath('');
        setFilePath('');
      }
    },
    [filePath, imagePath, isAttachFile, isAttachImage],
  );

  const handleOnPress = (text, onClick) => {
    setBlockChatBtn(true);
    if ((isAttachFile || isAttachImage) && onClick) {
      onClick([{text: text.trim()}], true);
      return;
    }
    if (text && onClick) {
      onClick([{text: text.trim()}], true);
    }
  };

  const renderSend = props => {
    console.log('isAttachFile', isAttachFile);
    console.log('isAttachImage', isAttachImage);
    console.log('props.text', props.text !== '');
    console.log('blockChatBtn', blockChatBtn);
    console.log(
      'block condi ============>',
      isAttachFile || isAttachImage
        ? false
        : blockChatBtn
        ? blockChatBtn
        : props.text !== ''
        ? false
        : true,
    );

    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={_pickDocument}>
          <Icon
            type="font-awesome"
            name="paperclip"
            style={styles.paperClip}
            size={28}
            color="blue"
          />
        </TouchableOpacity>
        <Send
          // disabled={
          //   isAttachFile || isAttachImage
          //     ? false
          //     : blockChatBtn
          //     ? blockChatBtn
          //     : props.text !== ''
          //     ? false
          //     : true
          // }
          {...props}
          sendButtonProps={{
            ...props.sendButtonProps,
            onPress: () => handleOnPress(props.text, props.onSend),
          }}>
          <View style={styles.sendContainer}>
            <Icon
              type="font-awesome"
              name="send"
              style={styles.sendButton}
              size={25}
              color="orange"
            />
          </View>
        </Send>
      </View>
    );
  };

  //show img 0r file in above txt box
  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={[styles.chatFooter, {}]}>
          <Image source={{uri: imagePath}} style={{height: 75, width: 75}} />
          <TouchableOpacity
            onPress={() => setImagePath('')}
            style={styles.buttonFooterChatImg}>
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filePath) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer
            filePath={filePath}
            fileName={filePath?.split('/').pop()}
          />
          <TouchableOpacity
            onPress={() => setFilePath('')}
            style={styles.buttonFooterChat}>
            <Text style={styles.textFooterChat}>X</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);

  const renderBubble = props => {
    const {currentMessage} = props;

    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id ===
              userDetails?.user_email?.toLowerCase()
                ? Colors.primaryBlue
                : Colors.gray,
            borderBottomLeftRadius:
              props.currentMessage.user._id ===
              userDetails?.user_email?.toLowerCase()
                ? 15
                : 5,
            borderBottomRightRadius:
              props.currentMessage.user._id ===
              userDetails?.user_email?.toLowerCase()
                ? 5
                : 15,
          }}
          onPress={() => {
            setFileVisible(true);
          }}>
          <InChatFileTransfer
            style={{marginTop: -10}}
            filePath={currentMessage.file.url}
            fileName={currentMessage.file.fileName}
          />
          <InChatViewFile
            props={props}
            visible={fileVisible}
            onClose={() => setFileVisible(false)}
          />
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                ...styles.fileText,
                color:
                  currentMessage.user._id ===
                  userDetails?.user_email?.toLowerCase()
                    ? 'white'
                    : 'black',
              }}>
              {currentMessage.text}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <>
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: Colors.primaryBlue,
            },
          }}
          textStyle={{
            right: {
              color: Colors.white,
            },
          }}
        />
      </>
    );
  };

  return (
    <View style={styles.screen}>
      {agentData?.agent_ID ? (
        loading ? (
          <ChatLoader />
        ) : (
          <>
            <GiftedChat
              showUserAvatar
              renderAvatarOnTop
              alwaysShowSend
              messagesContainerStyle={styles.messageContainer}
              messages={messages}
              onSend={messages => onSend(messages, tokens)}
              user={{_id: userDetails?.user_email?.toLowerCase()}}
              renderLoading={loading ? () => <ChatLoader /> : () => null}
              renderSend={renderSend}
              renderChatFooter={renderChatFooter}
              renderBubble={renderBubble}
              textInputStyle={{color: Colors.black}}
            />
          </>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  messageContainer: {
    backgroundColor: 'white',
  },
  sendtouchablestyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendimagestyle: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.surfblur,
  },
  sendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paperClip: {
    marginTop: 8,
    marginRight: 15,
    transform: [{rotateY: '180deg'}],
  },
  sendButton: {marginBottom: 10, marginRight: 10},
  chatFooter: {
    shadowColor: Colors.PrimaryColor,
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'blue',
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 66,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  textFooterChat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  fileContainer: {
    flex: 1,
    maxWidth: 300,
    marginVertical: 2,
    borderRadius: 15,
  },
  fileText: {
    marginVertical: 5,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 5,
  },
});
