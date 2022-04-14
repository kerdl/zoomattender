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
import { emit } from '@tauri-apps/api/event'
import { appWindow } from '@tauri-apps/api/window'
import { useState, useEffect } from 'react';
import { ZoomQuestion, Settings } from 'tabler-icons-react';


interface WatchRejoinConfirmProps {
    timeout: number | null;
    setTimeout: (timeout: number) => void;
}

function WatchRejoinConfirm(props: WatchRejoinConfirmProps) {
    const [clientWasOpened, setClientWasOpened] = useState(false);

    const [timerFill, setTimerFill] = useState(100);

    const [taskName, setTaskName] = useState('');
    const [taskStart, setTaskStart] = useState('');
    const [taskEnd, setTaskEnd] = useState('');

    useEffect(() => {
      invoke('task_name').then(name => {
        if (typeof name == "string") {
          console.log("task name: " + name); setTaskName(name)
        } 
      });
      invoke('task_start').then(start => {
        if (typeof start == "string") 
          setTaskStart(start) 
      });
      invoke('task_end').then(end => {
        if (typeof end == "string") 
          setTaskEnd(end) 
      });

      appWindow.center();
      appWindow.setFocus();
    }, [])

    // smoothly decrement timerFill 
    useEffect(() => {
      if (props.timeout != null && timerFill > 0) {
        const interval = setInterval(() => {
          if (clientWasOpened) {
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
          <Space h={10} />
          <Center>
            <Button 
              compact 
              variant='subtle' 
              leftIcon={<Settings size={18}/>} 
              color='gray'
              onClick={() => {
                invoke('run_client', {state: 'settings'}).then(() => emit('watchonly', {state: true}))
                setClientWasOpened((s) => !s)
              }}>
            Изменить настройки
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