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
  MantineProvider,
  LoadingOverlay,
  Transition,
  Switch

} from '@mantine/core';
import { X, Check } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import SettingsWindow from "./SettingsWindow";
import EditTaskWindow from './EditTaskWindow';
import { fetchTasks } from './BackendHelpers';
import { localTasks, localTask, prefs } from './JsonSchemas';

const SHORT_NAMES_LENGTH = 30;

function formatTime(start: Date, end: Date) {
  let startHr = start.getHours().toString();
  let startMin = start.getMinutes().toString();
  if (startMin.startsWith('0') && startMin.length < 2) {
    startMin = '0' + startMin;
  }

  let endHr = end.getHours().toString();
  let endMin = end.getMinutes().toString();
  if (endMin.startsWith('0') && endMin.length < 2) {
    endMin = '0' + endMin;
  }

  return (`${startHr}:${startMin} - ${endHr}:${endMin}`);
}

interface TaskControlsProps {
  localTaskContent: localTask
  prefsContent: prefs
  setPrefsContent: (o: prefs) => void
}

function EditModal(props: TaskControlsProps) {
  const [editOpenedState, setEditOpenedState] = useState(false);
  return (
    <>
      <EditTaskWindow
        opened={editOpenedState}
        toggleFunc={setEditOpenedState}
        localTaskContent={props.localTaskContent}
        prefsContent={props.prefsContent}
        setPrefsContent={props.setPrefsContent}
      />
      <ActionIcon
        variant="outline"
        size="xs"
        style={{ height: '20px', width: '30px' }}
        color='blue'
        onClick={() => setEditOpenedState(true)}>
        <Adjustments size={15} />
      </ActionIcon>
    </>
  );
}

function AttendCheckbox(props: TaskControlsProps) {
  const [attendCheckboxState, setAttendCheckboxState] = useState(true);
  return (
    <>
      <Tooltip label="Посетить" key="attendCheckboxTooltip">
        <Checkbox key="attendCheckbox"
          checked={attendCheckboxState}
          onChange={() => {
            invoke('set_task_state', {
              name: props.localTaskContent.name, 
              state: !attendCheckboxState
            })
            setAttendCheckboxState((o) => !o)
          }}
          color="ocean-blue" />
      </Tooltip>
    </>
  );
}

interface taskElements {
  localTaskContent: localTask,
  name: string,
  time: string,

  attendCheckbox: any,
  editModal: any,
}

interface TasksTableProps {
  localTasksContent: localTasks | null;
  setLocalTasksContent: (tasks: localTasks) => void;

  prefsContent: prefs;
  setPrefsContent: (prefs: prefs) => void;
}
function TasksTable(props: TasksTableProps) {
  const [elements, setElements] = useState<null | Array<taskElements>>(null);
  const [rows, setRows] = useState<any>(null);

  useEffect(() => {
    if (props.localTasksContent !== null) {
      if (props.localTasksContent.tasks.length > 0) {
        let els: taskElements[] = [];
        for (let i = 0; i < props.localTasksContent.tasks.length; i++) {
          const t = props.localTasksContent.tasks[i];

          let name = t.name;
          if (name.length > SHORT_NAMES_LENGTH) {
            name = name.substring(0, SHORT_NAMES_LENGTH) + '...';
          }

          let time = formatTime(new Date(t.end), new Date(t.end))

          const checkbox = <AttendCheckbox 
            localTaskContent={t} 
            prefsContent={props.prefsContent}
            setPrefsContent={props.setPrefsContent}
          />;
          const edit = <EditModal 
            localTaskContent={t}
            prefsContent={props.prefsContent}
            setPrefsContent={props.setPrefsContent}
          />;

          els.push({
            localTaskContent: t,
            name: name, 
            time: time,

            attendCheckbox: checkbox,
            editModal: edit,
          });
        }
        setElements(els);
      }
    }
  }, [props.localTasksContent])

  console.log(elements);

  useEffect(() => {
    if (elements !== null) {
      setRows(elements.map((element) => (
        <tr key={element.name}>
          <td>{element.attendCheckbox}</td>
          {element.name.length > SHORT_NAMES_LENGTH ?
            <td>
              <Tooltip 
                label={
                element.name.length > SHORT_NAMES_LENGTH ?
                  element.localTaskContent.name : null
                }
                openDelay={500}>
                {element.name}
              </Tooltip>
            </td> : <td>{element.name}</td>}
          <td>{element.time}</td>
          <td>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              {element.editModal}
            </div>
          </td>
        </tr>
      )));
    }
  }, [elements])


  //const elements = [
  //  { name: '1 пиздострадание Соси А.А.', time: '12:10 - 12:10' },
  //  { name: '2 пиздострадание Соси А.Б.', time: '12:10 - 12:10' },
  //  { name: '3 пиздострадание Соси А.В.', time: '12:10 - 12:10' },
  //  { name: '4 пиздострадание Соси А.Г.', time: '12:10 - 12:10' },
  //  { name: '5 пиздострадание Соси А.Д.', time: '12:10 - 12:10' },
  //  { name: '6 пиздострадание Соси А.Д.', time: '12:10 - 12:10' },
  //  { name: '7 пиздострадание Соси А.Д.', time: '12:10 - 12:10' },
  //];


  return (
    <>
      <ScrollArea style={{ height: 250 }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>хуй</th>
              <th>Имя</th>
              <th>Время</th>
              <th>Изменить</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
}

export { TasksTable }