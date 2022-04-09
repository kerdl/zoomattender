import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Adjustments, ArrowUpRight, Refresh, Settings } from 'tabler-icons-react';
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
    Container,
    MantineProvider,
    LoadingOverlay,
    Transition,
    Switch,
    Group
  
} from '@mantine/core';
import { X, Check } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import SettingsWindow from "./SettingsWindow";
import EditTaskWindow from './EditTaskWindow';
import { fetchTasks } from './BackendHelpers';
import { TasksTable } from './TasksTable';



const Menu = function Menu(props: any) {
    const [updateInProcess, setUpdateInProcess] = useState(false);
    const [updateAutomatically, setUpdateAutomatically] = useState(false);
    const [settingsOpened, setSettingsOpened] = useState(false);

    function _fetchTasks() {
      fetchTasks(props.settingsContent.tasks.api_url)
        .then(data => props.setFullTasksContent(data));
    }

    useEffect(() => {
      if (props.fromInitialSetup) {
        setUpdateInProcess((o) => !o); 
        _fetchTasks();
      }
      invoke('auto_upd_turned_on')
        .then((s: any) => setUpdateAutomatically(s))
    }, [])

    useEffect(() => {
      if (updateInProcess) {
        invoke('update_tasks', {
          tasks: JSON.stringify(props.fullTasksContent), 
          group: props.settingsContent.tasks.group
        })
          .then(data => {console.log(data);})
          .then(() => invoke('get_tasks_from_scheduler')
            .then(data => {
              if (typeof data == "string")
                props.setLocalTasksContent(JSON.parse(data))
            }))
          .then(() => setUpdateInProcess((o) => !o))
          .then(() => showNotification({
            color: 'green',
            icon: <Check />,
            autoClose: 3000,
            message: 'Задачи обновлены',
          }));
      }
    }, [props.fullTasksContent])

    return (
      <Container style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        {props.settingsContent && <SettingsWindow
          settingsOpened={settingsOpened}
          setSettingsOpened={setSettingsOpened}
          content={props.settingsContent}
          setContent={props.setSettingsContent}
          fullTasksContent={props.fullTasksContent}
          setFullTasksContent={props.setFullTasksContent}
          setShowInitialSetup={props.setShowInitialSetup}
        />}

        <Container>
          <Button compact variant='subtle' onClick={() => invoke('delete_all_tasks')} />
          <Group>
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              loading={updateInProcess}
              leftIcon={<Refresh size={20} />}
              onClick={() => {
                setUpdateInProcess((o) => !o); 
                _fetchTasks();
              }}
            >
            Обновить задачи
            </Button>
            <Switch
              checked={updateAutomatically}
              onChange={(s) => {
                const state = s.currentTarget.checked;
                setUpdateAutomatically(state); 
                invoke('set_automatic_upd', {state: state})
              }}
              label={<Text size="md">Обновлять автоматически</Text>}
              color="ocean-blue"
            />
          </Group>

          <Space h='xl' />

          <TasksTable 
            localTasksContent={props.localTasksContent} 
            setLocalTasksContent={props.setLocalTasksContent}

            prefsContent={props.prefsContent}
            setPrefsContent={props.setPrefsContent}
          />

          <Space h='sm' />

          <Center>
            <Button
              variant="outline"
              compact
              leftIcon={<ArrowUpRight />}
              onClick={() => invoke('open_scheduler')}>
            Открыть планировщик заданий
            </Button>
          </Center>

          <Space h='sm' />

          <Center>
            <Button
              color={"gray"}
              leftIcon={<Settings size={20} />}
              onClick={() => setSettingsOpened((s) => !s)}>
              Настройки
            </Button>
          </Center>
        </Container>
      </Container>
    );
}

export { Menu };