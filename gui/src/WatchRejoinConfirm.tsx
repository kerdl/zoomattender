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
  Alert, 
  Container,
  Badge, 
  Progress,
  Paper,
  TextInput
} from '@mantine/core';
import { invoke } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window'
import { useState, useEffect } from 'react';
import { ZoomQuestion, Language } from 'tabler-icons-react';

interface ZoomLanguageEditModalProps {
    opened: boolean;
    onClose: () => void;
}

function ZoomLanguageEditModal(props: ZoomLanguageEditModalProps) {
    return (
      <Modal 
        centered
        title="Язык Zoom"
        opened={props.opened} 
        onClose={props.onClose}>
        <Container>
          <Select
            data={[
              { value: 'en', label: 'English' },
              { value: 'ru', label: 'Русский' }
            ]}
            value={'en'}
            onChange={(e) => {
              console.log(e);
            }}
          />
        </Container>
      </Modal>
    );
}

interface WatchRejoinConfirmProps {
    timeout: number | null;
    setTimeout: (timeout: number) => void;
}

function WatchRejoinConfirm(props: WatchRejoinConfirmProps) {
    const [langEditOpened, setLangEditOpened] = useState(false);

    const [timerFill, setTimerFill] = useState(100);

    const [taskName, setTaskName] = useState('');
    const [taskStart, setTaskStart] = useState('');
    const [taskEnd, setTaskEnd] = useState('');

    invoke('task_name').then(name => {if (typeof name == "string") setTaskName(name) });
    invoke('task_start').then(start => {if (typeof start == "string") setTaskStart(start) });
    invoke('task_end').then(end => {if (typeof end == "string") setTaskEnd(end) });

    useEffect(() => {
      appWindow.center();
      appWindow.setFocus();
    }, [])

    // smoothly decrement timerFill 
    useEffect(() => {
      if (props.timeout != null && timerFill > 0) {
        const interval = setInterval(() => {
          if (langEditOpened) {
            setTimerFill(100);
          }
          else if (timerFill > 0) {
            setTimerFill(timerFill - 1);
          } 
          else {
            clearInterval(interval);
          }
        }, props.timeout * 10);
        return () => clearInterval(interval);
      }
    }, [timerFill, props.timeout]);




    //close window if timer is over
    useEffect(() => {
        //if (props.timeout !== null && timerFill === 0) {
        //  appWindow.close();
        //}
    }, [timerFill]);

    return (
      <Container style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Container>
          <Center>
            <Group direction='row'>
              <ZoomQuestion color='gray'/>
              <Text align='center' color='gray' size='lg'>Окна Zoom не найдены</Text>
            </Group>
          </Center>
          <Space h={10} />
              <Alert title={taskName} color="blue">
              <Center>
                <Group direction='row' spacing='xs'>
                  <Badge>Начало: {taskStart}</Badge>
                  <Badge>Конец: {taskEnd}</Badge>
                </Group>
              </Center>
              </Alert>
          <ZoomLanguageEditModal 
            opened={langEditOpened} 
            onClose={() => setLangEditOpened((s) => !s)} />
          <Space h={10} />
          <Center>
            <Button 
              compact 
              variant='subtle' 
              leftIcon={<Language size={18}/>} 
              color='gray'
              onClick={() => setLangEditOpened((s) => !s)}>
            Изменить язык Zoom
            </Button>
          </Center>
          <Space h={10} />
          <Progress value={timerFill} color='blue' />
          <Group direction='column'>
            <Button 
              fullWidth 
              compact 
              variant='light' 
              color='gray' 
              onClick={() => appWindow.close()}>
            Перезайти
            </Button>
            <Button 
              fullWidth 
              compact 
              variant='outline' 
              color='gray'
              onClick={() => invoke('exit_main')}>
            Отменить
            </Button>
          </Group>
        </Container>
      </Container>
    );
}

export { WatchRejoinConfirm };