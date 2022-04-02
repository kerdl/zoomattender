import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import SettingsWindow from "./SettingsWindow";
import EditTaskWindow from './EditTaskWindow';
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
  MantineProvider,

} from '@mantine/core';

async function updateRequest() {
  return new Promise(resolve => setTimeout(resolve, 2000, "content"))
}

console.log("entry point")

const Main = function Main(props: any) {
  const [updateInProcess, setUpdateInProcess] = useState(false)
  const [settingsOpened, setSettingsOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);

  const updateButton = <Button
    variant="gradient"
    gradient={{ from: 'indigo', to: 'cyan' }}
    loading={updateInProcess}
    leftIcon={<Refresh size={20} />}
    onClick={async () => {
      setUpdateInProcess((o) => !o); 
      await updateRequest();
      setUpdateInProcess((o) => !o); }}>
    Обновить задачи
  </Button>

  const tableEdit = <ActionIcon
    variant="outline"
    size="xs"
    style={{ height: '20px', width: '30px' }}
    color='blue'
    onClick={() => setEditOpened(true)}>
    <Adjustments size={15} />
  </ActionIcon>

  const attendCheckbox = [
    <Tooltip label="Посетить">
      <Checkbox
        defaultChecked
        color="ocean-blue" />
    </Tooltip>
  ]
  const elements = [
    { name: '1 пиздострадание Соси А.А.', time: '12:10 - 12:10' },
    { name: '2 пиздострадание Соси А.Б.', time: '12:10 - 12:10' },
    { name: '3 пиздострадание Соси А.В.', time: '12:10 - 12:10' },
    { name: '4 пиздострадание Соси А.Г.', time: '12:10 - 12:10' },
    { name: '5 пиздострадание Соси А.Д.', time: '12:10 - 12:10' },
    { name: '6 пиздострадание Соси А.Д.', time: '12:10 - 12:10' },
    { name: '7 пиздострадание Соси А.Д.', time: '12:10 - 12:10' },
  ];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{attendCheckbox}</td>
      <td>{element.name}</td>
      <td>{element.time}</td>
      <td>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>{tableEdit}
        </div>
      </td>
    </tr>
  ));

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {updateButton}
          <Space w='xl' />
          <Checkbox
            label={<Text size="md">Обновлять автоматически</Text>}
            color="ocean-blue"
          />
        </div>
        <Space h='xl' />
        <ScrollArea style={{ height: 250 }}>
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>{attendCheckbox}</th>
                <th>Имя</th>
                <th>Время</th>
                <th>Изменить</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </ScrollArea>
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
            onClick={() => setSettingsOpened(true)}>
            Настройки
          </Button>
        </Center>
        <SettingsWindow
          opened={settingsOpened}
          toggleFunc={setSettingsOpened}
        />
        <EditTaskWindow
          opened={editOpened}
          toggleFunc={setEditOpened}
        />
      </div>
    </div>


  );
}

export default Main;