import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Adjustments, ArrowUpRight, Refresh, Settings, Clipboard } from 'tabler-icons-react';
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
  Group,
  MantineProvider,
  LoadingOverlay,
  Transition,
  Modal,
  Container,
  Image,
  Switch

} from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { X, Check } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import SettingsWindow from "./SettingsWindow";
import EditTaskWindow from './EditTaskWindow';
import { fetchTasks } from './BackendHelpers';
import { localTasks, localTask, prefs } from './JsonSchemas';

function NotAllTasksModal(props: any) {
    const clipboard = useClipboard({ timeout: 1000 });

    return (
      <Modal
        centered
        title={"No bitches? 🤨"}
        opened={props.opened}
        onClose={props.onClose}>
      <ScrollArea style={{ height: 370, width: 420 }}>
        <Center>
          <Container size={400}>
              <Group>
                <Text>
                  Zoom данные берутся из базы этого ВК бота: 
                </Text>
                <Button compact variant='subtle' onClick={
                  () => invoke('open_link', {link: 'https://vk.com/ktmuslave'})
                }>
                  https://vk.com/ktmuslave
                </Button>
                <ActionIcon 
                  onClick={() => clipboard.copy('https://vk.com/ktmuslave')}>
                  {clipboard.copied ? <Check size={20}/> : <Clipboard size={20}/>}
                </ActionIcon>
                <Text>
                  Если хочешь добавить новые данные какого-то препода,
                  зарегайся в боте:
                </Text>
                <Image
                  src="ktmuslave_register.jpg">
                </Image>
                <Text>
                  Можешь ваще рандомную группу указать, это не так важно. 
                  А ещё, лучше выруби рассылку расписания.
                </Text>
                <Text>
                  Затем, перешли ему сообщение с данными от куратора:
                </Text>
                <Image
                  src="ktmuslave_data_send.jpg">
                </Image>
                <Image
                  src="ktmuslave_data_guide.jpg">
                </Image>
                <Text>
                  Ссылка и ID с паролем взаимозаменяемы. 
                  Например, если нет ссылки, достаточно ID с паролем. 
                  Или если нет ID с паролем, достаточно ссылки.
                </Text>
                <Text>
                  Короче, жми подробнее и подчиняйся негру:
                </Text>
                <Image
                  src="ktmuslave_data_detailed.jpg">
                </Image>
                <Text>
                  То же самое работает и с перезаписью данных. 
                  Просто пришли ему такое же сообщение с новыми данными 
                  и ФИО препода, которого хочешь перезаписать.
                </Text>
                <Text>
                  Уже через секунд 10 можешь обновлять задачи
                  и твой препод должен появиться здесь.
                </Text>
                <Text>
                  Дальше можешь спокойно удалиться из бота:
                </Text>
                <Image
                  src="ktmuslave_settings_point.jpg">
                </Image>
                <Image
                  src="ktmuslave_settings_reset.jpg">
                </Image>
              </Group>
          </Container>
        </Center>
      </ScrollArea>
      </Modal>
    );
}

export {NotAllTasksModal};