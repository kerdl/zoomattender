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
  Select,
  Image,
  Text
} from '@mantine/core';
import React, { useState } from 'react';

const ResetConfirm = function ResetConfirm(props: any) {
  return (
    <Modal
      opened={props.opened}
      onClose={() => props.toggleFunc()}
      title="Сбросить настройки"
    >
      <Center>
        <Image
          src="reset_settings.jpg">
        </Image>
      </Center>
      <Space h="md" />
      <Center>
        <Button
          color="red"
          onClick={() => props.toggleFunc()}>
          Сбросить
        </Button>
      </Center>
    </Modal>
  )
}

const SettingsWindow = function SettingsWindow(props: any) {
  const [apiValue, setApiValue] = useState(
    "https://api.npoint.io/3c76aea653761267e1f2"
  );
  const [groupValue, setGroupValue] = useState<string | null>("1КДД22");
  const [zoomPathValue, setZoomPathValue] = useState(
    "%APPDATA%\\Zoom\\bin\\Zoom.exe"
  );
  const [zoomArgsValue, setZoomArgsValue] = useState(
    "\"--url=zoommtg://zoom.us/join?action=join&confno={}&pwd={}\""
  );
  const [rejoinValue, setRejoinValue] = useState(true)
  const [killZoomValue, setKillZoomValue] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Modal
        opened={props.opened}
        onClose={() => props.toggleFunc()}
        title="Настройки"
      >
        <Divider my="xs" label="Задачи" labelPosition="center" />
        <TextInput
          label="API"
          value={apiValue}
          onChange={(event) => setApiValue(event.currentTarget.value)}>
        </TextInput>
        <Space h='sm' />
        <Select
          label="Группа"
          placeholder="Выбрать"
          data={[
            { value: '1КДД20', label: '1КДД20' },
            { value: '1КДД22', label: '1КДД22' }
          ]}
          value={groupValue}
          onChange={(string) => setGroupValue(string)}
        />
        <Divider my="xs" label="Zoom" labelPosition="center" />
        <TextInput
          required
          label="Путь до Zoom.exe"
          value={zoomPathValue}
          onChange={(event) => setZoomPathValue(event.currentTarget.value)}
          error={zoomPathValue.length <= 0 ? "Без пути хз как открыть зум..." : false} />
        <Space h="sm" />
        <TextInput
          required
          label="Аргументы"
          defaultValue={"\"--url=zoommtg://zoom.us/join?action=join&confno={id}&pwd={pwd}\""}
          value={zoomArgsValue}
          onChange={(event) => setZoomArgsValue(event.currentTarget.value)}
          error={zoomArgsValue.length <= 0 ? "Без них не зайти в конфу окда" : false} />
        <Space h="sm" />

        <Divider my="xs" label="Перезаход" labelPosition="center" />
        <Checkbox
          label="Перезаходить"
          color="ocean-blue"
          checked={rejoinValue}
          onChange={(event) => setRejoinValue(event.currentTarget.checked)} />
        <Space h="sm" />
        <NumberInput
          defaultValue={2}
          label="Максимальное время отсутствия окон Zoom"
          description="в секундах"
          min={1}
          stepHoldDelay={500}
          stepHoldInterval={50}
          disabled={!rejoinValue}
        />
        <Space h="sm" />
        <Select
          label="Язык Zoom"
          placeholder="Выбрать"
          data={[
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' }
          ]}
          disabled={!rejoinValue}
        />
        <Space h="sm" />
        <Textarea
          spellCheck="false"
          label="Названия окон Zoom"
          defaultValue={
            "\"ConfMeetingNotfiyWnd\", \"Connecting\", \"Zoom Meeting\", \"Waiting for Host\""
          }
          disabled={!rejoinValue}>
        </Textarea>
        <Space h="sm" />
        <NumberInput
          defaultValue={10}
          label="Сколько ждать подтверждения перезайти"
          description="в секундах"
          min={0}
          stepHoldDelay={500}
          stepHoldInterval={50}
          disabled={!rejoinValue}
        />
        <Space h="sm" />
        <NumberInput
          noClampOnBlur
          defaultValue={10}
          label="За сколько до конца задачи не пытаться перезаходить"
          description="в минутах"
          min={1}
          stepHoldDelay={500}
          stepHoldInterval={50}
          disabled={!rejoinValue}
        />

        <Divider my="xs" label="Конфликты" labelPosition="center" />
        <Checkbox
          label="Убивать Zoom до начала следующей задачи"
          color="ocean-blue"
          checked={killZoomValue}
          onChange={(event) => setKillZoomValue(event.currentTarget.checked)} />

        <Divider my="xs" label="Уведомления" labelPosition="center" />
        <Checkbox
          defaultChecked
          label="Уведомлять об обновлении задач"
          color="ocean-blue" />

        <Space h="xl" />

        <Center>
          <Button
            color="red"
            onClick={() => setShowResetConfirm(true)}>
            Сбросить настройки
          </Button>
        </Center>

        <ResetConfirm
          opened={showResetConfirm}
          toggleFunc={setShowResetConfirm}
        />

      </Modal>
    </div>
  );
}

export default SettingsWindow;