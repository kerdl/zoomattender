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
import {
  DatePicker,
  TimeRangeInput
} from '@mantine/dates'
import { useState } from 'react';


const EditTaskWindow = function EditTaskWindow(props: any) {
  const [timeValue, setTimeValue] = useState<[Date, Date]>([new Date(), new Date()])
  const [dateValue, setDateValue] = useState<[Date | null]>([new Date()])
  const [zoomVariantValue, setZoomVariantValue] = useState<string | null>("Соси А.А.")
  const [idValue, setIdValue] = useState("228 1337 6969")
  const [pwdValue, setPwdValue] = useState("so tr")

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
        <Center>
        <TimeRangeInput
          required
          value={timeValue}
          onChange={setTimeValue}
          error={
            timeValue[0] == null ||
              timeValue[1] == null ? true : false}
          clearable
          label="Промежуток задачи" />
        <Space w="sm" />
        <DatePicker
          required
          value={dateValue[0]}
          onChange={(d) => setDateValue([d])}
          error={dateValue[0] == null}
          label="Дата задачи"
          placeholder="Выбрать" />
        </Center>
        <Divider my="xs" label="Zoom" labelPosition="center" />
        <Select
            label="Вариант"
            placeholder="Выбрать"
            data={[
              { value: 'Соси А.А.', label: 'Соси А.А.' },
              { value: 'Соси А.Б.', label: 'Соси А.Б.' }
            ]}
            value={zoomVariantValue}
            onChange={(string) => setZoomVariantValue(string)}
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
          value={pwdValue}
          onChange={(event) => setPwdValue(event.currentTarget.value)}
          label="Пароль" />
        </Center>
      </div>
    </Modal>
  )
}

export default EditTaskWindow;