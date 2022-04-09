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
  Text
} from '@mantine/core';
import { TimeRangeInput} from '@mantine/dates'
import { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { localTask, prefs } from './JsonSchemas';

function seekVariant(localTask: localTask, id: string) {
  for (let i = 0; i < localTask.description.zoom_data.length; i++) {
    const v = localTask.description.zoom_data[i];
    if (v.data.id == id) {
      return v.name;
    }
  }
  return null;
}

function seekData(localTask: localTask, variant: string) {
  for (let i = 0; i < localTask.description.zoom_data.length; i++) {
    const v = localTask.description.zoom_data[i];
    if (v.name == variant) {
      return v.data;
    }
  }
  return null;
}

function getVariants(localTask: localTask) {
  let variants = [];
  for (let i = 0; i < localTask.description.zoom_data.length; i++) {
    const v = localTask.description.zoom_data[i];
    variants.push(v.name);
  }
  return variants;
}

interface EditTaskWindowProps {
  opened: any,
  toggleFunc: (state: boolean) => void,
  localTaskContent: localTask,
  prefsContent: prefs,
  setPrefsContent: (prefs: prefs) => void
}
function EditTaskWindow(props: EditTaskWindowProps) {
  const [timeValue, setTimeValue] = useState<[Date, Date]>([
    new Date(props.localTaskContent.start), 
    new Date(props.localTaskContent.end)
  ])
  const [zoomVariantValue, setZoomVariantValue] = useState<string | null>(
    seekVariant(props.localTaskContent, props.localTaskContent.id)
  )
  const [idValue, setIdValue] = useState(props.localTaskContent.id)
  const [pwdValue, setPwdValue] = useState(props.localTaskContent.pwd)

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
            onChange={(s) => {
              if (s != null) {
                invoke('replace_teacher_pref', {
                  prefs: JSON.stringify(props.prefsContent), 
                  old: zoomVariantValue ? zoomVariantValue : "", 
                  new: s
                })
                  .then(data => {
                    if (typeof data == "string") 
                      props.setPrefsContent(JSON.parse(data)); 
                      console.log(data)
                  })

                let data = seekData(props.localTaskContent, s)
                if (data != null) {
                  invoke('edit_task', {
                    name: props.localTaskContent.name, 
                    start: null, 
                    end: null, 
                    id: data.id, 
                    pwd: data.pwd
                  });
                  setIdValue(data.id);
                  setPwdValue(data.pwd);
                }
                
              }

              setZoomVariantValue(s);
            }}
          />
        <Space h="sm" />
        <Center>
        <TextInput
          required
          value={idValue}
          onChange={(event) => setIdValue(event.currentTarget.value)}
          error={idValue.length <= 0 ? true : false}
          label="ID" />
        <Space w="sm" />
        <TextInput
          value={pwdValue ? pwdValue : ""}
          onChange={(event) => setPwdValue(event.currentTarget.value)}
          label="Пароль" />
        </Center>
      </div>
    </Modal>
  )
}

export default EditTaskWindow;