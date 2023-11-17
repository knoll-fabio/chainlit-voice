import {
  useChatData,
  useChatInteract,
  useChatMessages
} from '@chainlit/react-client';

import { IProjectSettings } from 'state/project';

import MessageContainer from './container';
import WelcomeScreen from './welcomeScreen';
import React, { useEffect } from 'react';

interface MessagesProps {
  autoScroll: boolean;
  projectSettings?: IProjectSettings;
  setAutoScroll: (autoScroll: boolean) => void;
}

const Messages = ({
  autoScroll,
  projectSettings,
  setAutoScroll
}: MessagesProps): JSX.Element => {
  const { elements, askUser, avatars, loading, actions } = useChatData();
  const { messages } = useChatMessages();
  const { callAction } = useChatInteract();

  const playAudio = (audio: ArrayBuffer) => {
    const audioBlob = new Blob([audio], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioElement = new Audio(audioUrl);
    audioElement.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    audioElement.play();
  };

  if (elements.length > 0) {
    const lastElement = elements[elements.length - 1];
    if (lastElement.content) {
      //playAudio(lastElement.content);
    }
  }

  useEffect(() => {
    if (elements.length > 0) {
      const lastElement = elements[elements.length - 1];
      console.log(lastElement)
      if (lastElement.content) {
        playAudio(lastElement.content);
      }
    }
  }, [elements]);

  const filteredElements = elements.filter((element) => element.type !== 'audio');
  console.log(filteredElements)

  return !messages.length && projectSettings?.ui.show_readme_as_default ? (
    <WelcomeScreen markdown={projectSettings?.markdown} />
  ) : (
    <MessageContainer
      avatars={avatars}
      loading={loading}
      askUser={askUser}
      actions={actions}
      elements={filteredElements}
      messages={messages}
      autoScroll={autoScroll}
      callAction={callAction}
      setAutoScroll={setAutoScroll}
    />
  );
};

export default Messages;
