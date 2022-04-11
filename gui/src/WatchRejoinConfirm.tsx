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
import { useState, useEffect } from 'react';
import { ZoomQuestion } from 'tabler-icons-react';


function WatchRejoinConfirm() {
    const [timerFill, setTimerFill] = useState(100);

    // smoothly decrement timerFill in 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setTimerFill((current) => (current > 0 ? current - 1 : current));
        }, 200);
        return () => clearInterval(interval);
    }, []);

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
              <Alert title='Живопись. Малютина Е.Н., Чаликова Е.А.' color="blue">
              <Center>
                <Group direction='row' spacing='xs'>
                  <Badge>Начало: 12:10</Badge>
                  <Badge>Конец: 13:40</Badge>
                </Group>
              </Center>
              </Alert>
            
          <Space h={25} />
          <Progress value={timerFill} color='blue' />
          <Group direction='column'>
            
            <Button fullWidth compact variant='light' color='gray'>Перезайти</Button>
            <Button fullWidth compact variant='outline' color='gray'>Отменить</Button>
          </Group>
        </Container>
      </Container>
    );
}

export { WatchRejoinConfirm };