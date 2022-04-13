import {
  Modal,
  Button,
  Center,
  NumberInput,
  Textarea,
  TextInput,
  Divider,
  Checkbox,
  Space,
  MantineProvider,
  Select,
  Image,
  ScrollArea,
  Group,
  Text
} from '@mantine/core';
import { X, Check } from 'tabler-icons-react';
import { TimeRangeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { localTask, prefs } from './JsonSchemas';
import { validId } from './Strings';

function seekData(localTask: localTask, variant: string) {
  let parsing = localTask.description;
  if (typeof localTask.description == "string") {
    parsing = JSON.parse(localTask.description);
  }

  for (let i = 0; i < parsing.zoom_data.length; i++) {
    const v = parsing.zoom_data[i];
    if (v.name == variant) {
      return v.data;
    }
  }
  return null;
}

function seekVariant(localTask: localTask, id: string) {
  let parsing = localTask.description;
  if (typeof localTask.description == "string") {
    parsing = JSON.parse(localTask.description);
  }

  for (let i = 0; i < parsing.zoom_data.length; i++) {
    const v = parsing.zoom_data[i];
    if (v.data.id == id) {
      return v.name;
    }
  }
  return null;
}

function getVariants(localTask: localTask) {
  let variants = [];

  let parsing = localTask.description;
  if (typeof localTask.description == "string") {
    parsing = JSON.parse(localTask.description);
  }

  for (let i = 0; i < parsing.zoom_data.length; i++) {
    const v = parsing.zoom_data[i];
    variants.push(v.name);
  }
  return variants;
}

function formatDateToWindowsUtcPlus3(date: Date) {
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString().slice(0, -5) + '+03:00';
}

interface EditTaskWindowProps {
  opened: any,
  toggleFunc: (state: boolean) => void,
  localTaskContent: localTask,
  prefsContent: prefs,
  setPrefsContent: (prefs: prefs) => void
  refreshLocalTasksContent: (automaticInvoke: boolean) => void
}
function EditTaskWindow(props: EditTaskWindowProps) {
  const [timeValue, setTimeValue] = useState<[Date, Date]>([
    new Date(props.localTaskContent.start), 
    new Date(props.localTaskContent.end)
  ]);
  const [zoomVariantValue, setZoomVariantValue] = useState<string | null>(
    props.localTaskContent.description ? 
    seekVariant(props.localTaskContent, props.localTaskContent.id) : null
  );
  const [prevZoomVariantValue, setPrevZoomVariantValue] = useState<string | null>(
    props.localTaskContent.description ? 
    seekVariant(props.localTaskContent, props.localTaskContent.id) : null
  );
  const [idValue, setIdValue] = useState(props.localTaskContent.id);
  const [pwdValue, setPwdValue] = useState(props.localTaskContent.pwd);

  const required = [
    !!timeValue[0],
    !!timeValue[1],
    !!idValue
  ];

  function resetTaskContent() {
    setTimeValue([new Date(props.localTaskContent.start), new Date(props.localTaskContent.end)]);
    setZoomVariantValue(props.localTaskContent.description ? 
      seekVariant(props.localTaskContent, props.localTaskContent.id) : null
    )
    setIdValue(props.localTaskContent.id)
    setPwdValue(props.localTaskContent.pwd)
  };

  function setVariant(newVariant: string) {
    if (newVariant != null) {
      console.log("old variant: " + prevZoomVariantValue, "new variant: " + newVariant)
      invoke('replace_teacher_pref', {
        old: prevZoomVariantValue ? prevZoomVariantValue : "", 
        new: newVariant
      })
    }
    setPrevZoomVariantValue(zoomVariantValue);
  };

  function saveTaskContent() {
    if (required.every(v => v == true)) {
      if (zoomVariantValue) setVariant(zoomVariantValue);
      let doEnable = props.localTaskContent.enabled;
      if (props.localTaskContent.id == "0") {
        doEnable = true;
      }
      console.log('local task ' + props.localTaskContent.name);
      invoke('edit_task', {
        name: props.localTaskContent.name, 
        enabled: doEnable,
        start: formatDateToWindowsUtcPlus3(timeValue[0]), 
        end: formatDateToWindowsUtcPlus3(timeValue[1]), 
        id: idValue, 
        pwd: pwdValue
      })
        .then(() => showNotification({
          color: 'green',
          icon: <Check />,
          autoClose: 3000,
          message: 'Сохранено',
        }))
        .then(() => {console.log("refreshing tasks"); props.refreshLocalTasksContent(true)});
    }
    else {
      showNotification({
        color: 'red',
        icon: <X />,
        autoClose: 3000,
        message: 'Заполнено не всё',
      });
    }
  };

  return (
    <Modal
      centered
      title="Изменить задачу"
      opened={props.opened}
      onClose={() => props.toggleFunc(false)}>
      <div 
        style={{
          marginRight: '20px',
          marginLeft: '20px'
        }}>
        <Divider
          my="xs"
          label="Время"
          labelPosition="center" />
        <TimeRangeInput
          required
          value={timeValue}
          onChange={setTimeValue}
          error={
            timeValue[0] == null ||
              timeValue[1] == null ? true : false}
          clearable
          label="Промежуток задачи" />
        <Divider my="xs" label="Zoom" labelPosition="center" />
        <Select
            label="Вариант"
            placeholder="Выбрать"
            data={getVariants(props.localTaskContent)}
            value={zoomVariantValue}
            onChange={(newVariant) => {
              if (newVariant) {
                let d = seekData(props.localTaskContent, newVariant)
                if (d) {
                  setIdValue(d.id)
                  setPwdValue(d.pwd)
                }
              }
              console.log("old variant: " + prevZoomVariantValue, "new variant: " + newVariant)
              setZoomVariantValue(newVariant);
            }}
          />
        <Space h="sm" />
        <Center>
        <TextInput
          required
          value={idValue}
          onChange={(event) => {
            setIdValue(validId(event.currentTarget.value))
            if (typeof event.currentTarget.value == "string") {
              let v = seekVariant(props.localTaskContent, event.currentTarget.value)
              setZoomVariantValue(v);
            }
          }}
          error={idValue.length <= 0 ? true : false}
          label="ID" />
        <Space w="sm" />
        <TextInput
          value={pwdValue ? pwdValue : ""}
          onChange={(event) => setPwdValue(event.currentTarget.value)}
          label="Пароль" />
        </Center>
      </div>
      <Space h={20} />
      <Center>
        <Group>
          <Button
            compact
            color='gray'
            onClick={() => resetTaskContent()}>
            <Text weight={30} size='sm'>Отменить</Text>
          </Button>
          <Button
            compact
            color='blue'
            onClick={() => saveTaskContent()}>
            <Text weight={30} size='sm'>Сохранить</Text>
          </Button>
        </Group>
      </Center>
    </Modal>
  )
}

export default EditTaskWindow;