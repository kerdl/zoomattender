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
  import {useState} from 'react';
  import {ArrowRight} from 'tabler-icons-react';

function EnterZoomLanguageFrame(props: any) {
    return (
      <div>
        <Text 
          color="gray"
          align='center'
        >
        Используется для перезахода
        </Text>
        <Space h='sm' />
        <Container size={300}>
        <Select
          value={props.settingsZoomLanguage}
          onChange={(v) => props.setSettingsZoomLanguage(v)}
          placeholder="Язык Zoom"
          data={[
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' }
          ]}
        />
        </Container>
        <Space h='sm' />
        <Center>
          <Button 
              compact 
              color="gray" 
              variant="subtle"
              onClick={() => props.nextStep()}
          >
          Не перезаходить в Zoom
          </Button>
        </Center>
        
      </div>
    );
}

export { EnterZoomLanguageFrame };