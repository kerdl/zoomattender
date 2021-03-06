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
  Switch,
  ThemeIcon

} from '@mantine/core';
import { X, ExclamationMark } from 'tabler-icons-react';
import { showNotification } from '@mantine/notifications';
import SettingsWindow from "./SettingsWindow";
import EditTaskWindow from './EditTaskWindow';
import { NotAllTasksModal } from './NotAllTasksModal';
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
  refreshLocalTasksContent: (automaticInvoke: boolean) => void
  localTaskContent: localTask
  prefsContent: prefs
  setPrefsContent: (o: prefs) => void
}

function EditModal(props: TaskControlsProps) {
  const [editOpenedState, setEditOpenedState] = useState(false);
  console.log("edit modal", props.refreshLocalTasksContent)
  return (
    <>
      <EditTaskWindow
        refreshLocalTasksContent={props.refreshLocalTasksContent}
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

  useEffect(() => {
    if (props.localTaskContent != null) {
      setAttendCheckboxState(props.localTaskContent.enabled);
    }
  }, [props.localTaskContent])

  return (
    <>
      {props.localTaskContent.id == "0" &&
        <Tooltip 
          label='???????????? ??????????????, ?????????? "????????????????" ???????????????? ????????????' 
          key="taskErrorTooltip">
          <ExclamationMark size={22} color='#d2797a'/>
        </Tooltip>
      }
      {props.localTaskContent.id != "0" && 
      <Tooltip label="????????????????" key="attendCheckboxTooltip">
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
      }
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
  refreshLocalTasksContent: (automaticInvoke: boolean) => void;

  localTasksContent: localTasks | null;
  setLocalTasksContent: (tasks: localTasks) => void;

  prefsContent: prefs;
  setPrefsContent: (prefs: prefs) => void;
}
function TasksTable(props: TasksTableProps) {
  const [elements, setElements] = useState<null | Array<taskElements>>(null);
  const [rows, setRows] = useState<any>(null);
  const [notAllTasksModalOpened, setNotAllTasksModalOpened] = useState(false);

  useEffect(() => {
    if (props.localTasksContent !== null) {
        let els: taskElements[] = [];
        for (let i = 0; i < props.localTasksContent.tasks.length; i++) {
          const t = props.localTasksContent.tasks[i];

          let name = t.name;
          if (name.length > SHORT_NAMES_LENGTH) {
            name = name.substring(0, SHORT_NAMES_LENGTH) + '...';
          }

          let time = formatTime(new Date(t.start), new Date(t.end))

          console.log("tasks table", props.refreshLocalTasksContent)
          const checkbox = <AttendCheckbox 
            refreshLocalTasksContent={props.refreshLocalTasksContent}
            localTaskContent={t} 
            prefsContent={props.prefsContent}
            setPrefsContent={props.setPrefsContent}
          />;
          const edit = <EditModal 
            refreshLocalTasksContent={props.refreshLocalTasksContent}
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
  //  { name: '1 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //  { name: '2 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //  { name: '3 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //  { name: '4 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //  { name: '5 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //  { name: '6 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //  { name: '7 ???????????????????????????? ???????? ??.??.', time: '12:10 - 12:10' },
  //];


  return (
    <>
      <NotAllTasksModal 
        opened={notAllTasksModalOpened} 
        onClose={() => setNotAllTasksModalOpened((s) => !s)} />
      <ScrollArea style={{ height: 250 }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th></th>
              <th>??????</th>
              <th>??????????</th>
              <th>????????????????</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Space h='md' />
        <Center>
          <Button 
            compact 
            variant='subtle' 
            color='gray'
            onClick={() => setNotAllTasksModalOpened((s) => !s)}>
          ???? ?????? ???????????? / ???????????????? Zoom?
          </Button>
        </Center>
        
      </ScrollArea>
    </>
  );
}

export { TasksTable }