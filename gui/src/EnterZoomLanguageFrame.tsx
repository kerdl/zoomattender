import {
    Text,
    Popover,
    Button,
    Checkbox,
    Space,
    ScrollArea,
    Table,
    ActionIcon,
    Notification, 
    Loader, 
    Tooltip,
    Center,
    MantineProvider,
    LoadingOverlay,
    Overlay,
    Modal,
    Select,
    Stepper,
    Container,
    Group,
    TextInput
  } from '@mantine/core';
  import { useState } from 'react';
  import { Language } from 'tabler-icons-react';
  import { getLanguages } from './BackendHelpers';


function EnterZoomLanguageFrame(props: any) {
    return (
      <div>
        <Text 
          color="gray"
          align='center'
        >
        Язык Zoom для перезахода
        </Text>
        <Space h='sm' />
        <Container size={300}>
        <Select
          icon={<Language size={18} />}
          value={props.settingsZoomLanguage}
          onChange={(v) => props.setSettingsZoomLanguage(v)}
          placeholder="Язык Zoom"
          data={getLanguages(props.langs)}
          disabled={!props.settingsDoRejoin}
        />
        </Container>
        <Space h='sm' />
        <Center>
          <Checkbox 
              color="gray" 
              label="Не перезаходить в Zoom"
              checked={!props.settingsDoRejoin}
              onChange={(e) => props.setSettingsDoRejoin(!e.currentTarget.checked)}
          />
        </Center>
        
      </div>
    );
}

export { EnterZoomLanguageFrame };