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
  Group,
  Container,
  TextInput
} from '@mantine/core';
import {useState} from 'react';
import {ArrowRight} from 'tabler-icons-react';
import {saveSettings} from './BackendHelpers';

function FinishSetup(props: any) {
    return (
      <Container>
        {props.allDone ? <Text
          color="gray"
          align='center'>
          На всякий случай чекни 
          потом остальные настройки,
          вдруг чё хочешь изменить
        </Text> : <Text
          color="gray"
          align='center'>
          Не все пункты установлены,
          проверь всё ещё раз
        </Text>}
        {props.allDone && <Space h={20} />}
        {props.allDone && <Center>
          <Button 
            onClick={() => {
              props.toggleFunc(); 
              props.setSettingsContent(props.modifiedContent);
              saveSettings(props.modifiedContent);
            }}>
            Завершить
          </Button>
        </Center>}
      </Container>
    );
}

export { FinishSetup };