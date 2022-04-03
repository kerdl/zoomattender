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

function FinishSetup(props: any) {
    return (
      <Container>
        <Text
          color="gray"
          align='center'>
          На всякий случай чекни 
          потом остальные настройки,
          вдруг чё хочешь изменить
        </Text>
        <Space h={20} />
        <Center>
          <Button 
            onClick={() => props.toggleFunc()}>
            Завершить
          </Button>
        </Center>
      </Container>
    );
}

export { FinishSetup };