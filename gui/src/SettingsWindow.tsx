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
  ScrollArea
} from '@mantine/core';
import React, { useState } from 'react';
import {settingsSchema} from './JsonSchemas'


const ResetConfirm = function ResetConfirm(props: any) {
  console.log(settingsSchema.tasks.api_url)
  return (
    <Modal
      centered
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
  const [SettingsApiUrl, setSettingsApiUrl] = useState("");
  const [SettingsGroup, setSettingsGroup] = useState<string | null>("1КДД22");
  const [SettingsZoomPath, setSettingsZoomPath] = useState(
    "%APPDATA%\\Zoom\\bin\\Zoom.exe"
  );
  const [SettingsDoRejoin, setSettingsDoRejoin] = useState(true)
  const [SettingsMaxNoWindows, setSettingsMaxNoWindows] = useState(2)
  const [killZoomValue, setKillZoomValue] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Modal
        centered
        opened={props.opened}
        onClose={() => props.toggleFunc()}
        title="Настройки"
      >
        <ScrollArea style={{ height: 420 }}>
          <div 
            style={{
              marginRight: '20px',
              marginLeft: '20px'
            }}>
          <Divider my="xs" label="Задачи" labelPosition="center" />
          <TextInput
            required
            label="API"
            value={SettingsApiUrl}
            error={SettingsApiUrl.length <= 0 ? true : false}
            onChange={(event) => setSettingsApiUrl(event.currentTarget.value)}>
          </TextInput>
          <Space h='sm' />
          <Select
            required
            label="Группа"
            placeholder="Выбрать"
            data={[
              { value: '1КДД20', label: '1КДД20' },
              { value: '1КДД22', label: '1КДД22' }
            ]}
            value={SettingsGroup}
            error={SettingsGroup == null ? true : false}
            onChange={(string) => setSettingsGroup(string)}
          />
          <Divider my="xs" label="Zoom" labelPosition="center" />
          <TextInput
            required
            label="Путь до Zoom.exe"
            value={SettingsZoomPath}
            onChange={(event) => setSettingsZoomPath(event.currentTarget.value)}
            error={SettingsZoomPath.length <= 0 ? true : false} />
          <Space h="sm" />

          <Divider my="xs" label="Перезаход" labelPosition="center" />
          <Checkbox
            label="Перезаходить"
            color="ocean-blue"
            checked={SettingsDoRejoin}
            onChange={(event) => setSettingsDoRejoin(event.currentTarget.checked)} />
          <Space h="sm" />
          <NumberInput
            defaultValue={2}
            error={SettingsDoRejoin == false ? true : false}
            label="Максимальное время отсутствия окон Zoom"
            description="в секундах"
            min={1}
            stepHoldDelay={500}
            stepHoldInterval={50}
            disabled={!SettingsDoRejoin}
          />
          <Space h="sm" />
          <Select
            label="Язык Zoom"
            placeholder="Выбрать"
            data={[
              { value: 'ru', label: 'Русский' },
              { value: 'en', label: 'English' }
            ]}
            disabled={!SettingsDoRejoin}
          />
          <Space h="sm" />
          <Textarea
            spellCheck="false"
            label="Названия окон Zoom"
            defaultValue={
              "\"ConfMeetingNotfiyWnd\", \"Connecting\", \"Zoom Meeting\", \"Waiting for Host\""
            }
            disabled={!SettingsDoRejoin}>
          </Textarea>
          <Space h="sm" />
          <NumberInput
            defaultValue={10}
            label="Сколько ждать подтверждения перезайти"
            description="в секундах"
            min={0}
            stepHoldDelay={500}
            stepHoldInterval={50}
            disabled={!SettingsDoRejoin}
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
            disabled={!SettingsDoRejoin}
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
        </div>
        </ScrollArea>
        
      </Modal>
    </div>
  );
}

export default SettingsWindow;