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
import {settings} from './JsonSchemas';


const ResetConfirm = function ResetConfirm(props: any) {
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
  let c: settings = props.content;
  const [settingsApiUrl, setSettingsApiUrl] = useState(c ? c.tasks.api_url : "");
  const [settingsGroup, setSettingsGroup] = useState<string | null>(c ? c.tasks.group : "");
  const [settingsZoomPath, setSettingsZoomPath] = useState(c ? c.zoom.zoom_path : "");
  const [settingsDoRejoin, setSettingsDoRejoin] = useState(c ? c.rejoin.do_rejoin : false);
  const [settingsMaxNoWindows, setSettingsMaxNoWindows] = useState(c ? c.rejoin.max_no_windows : 0);
  const [settingsZoomLanguage, setSettingsZoomLanguage] = useState(c ? c.rejoin.zoom_language : "");
  const [settingsZoomWindnames, setSettingsZoomWindnames] = useState(c ? c.rejoin.zoom_windnames : "");
  const [settingsRejoinConfirmAwait, setSettingsRejoinConfirmAwait] = useState(c ? c.rejoin.rejoin_confirm_await : 0);
  const [settingsDoNotRejoinEnd, setSettingsDoNotRejoinEnd] = useState(c ? c.rejoin.do_not_rejoin_end : 0);
  const [settingsKillZoom, setSettingsKillZoom] = useState(c ? c.conflicts.kill_zoom : false);
  const [settingsTaskUpdNotify, setSettingsTaskUpdNotify] = useState(c ? c.notifications.task_upd_notify : false);
  const [settingsQuestionableZoomVariant, setSettingsQuestionableZoomVariant] = useState(c ? c.notifications.questionable_zoom_variant : false);

  const [settingsShowResetConfirm, setSettingsShowResetConfirm] = useState(false)

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
              value={settingsApiUrl}
              error={settingsApiUrl.length <= 0 ? true : false}
              onChange={(event) => setSettingsApiUrl(event.currentTarget.value)}
            />

            <Space h='sm' />

            <Select
              required
              label="Группа"
              placeholder="Выбрать"
              data={[
                { value: '1КДД20', label: '1КДД20' },
                { value: '1КДД22', label: '1КДД22' }
              ]}
              value={settingsGroup}
              error={settingsGroup == null ? true : false}
              onChange={(string) => setSettingsGroup(string)}
            />
            <Divider my="xs" label="Zoom" labelPosition="center" />
            <TextInput
              required
              label="Путь до Zoom.exe"
              value={settingsZoomPath}
              onChange={(event) => setSettingsZoomPath(event.currentTarget.value)}
              error={settingsZoomPath.length <= 0 ? true : false} 
            />
            
            <Space h="sm" />

            <Divider my="xs" label="Перезаход" labelPosition="center" />
            <Checkbox
              label="Перезаходить"
              color="ocean-blue"
              checked={settingsDoRejoin}
              onChange={(event) => setSettingsDoRejoin(event.currentTarget.checked)} />
            
            <Space h="sm" />

            <NumberInput
              value={settingsMaxNoWindows}
              onChange={(n) => setSettingsMaxNoWindows(n ? n : 0)}
              error={settingsMaxNoWindows == null ? true : false}
              label="Максимальное время отсутствия окон Zoom"
              description="в секундах"
              min={1}
              stepHoldDelay={500}
              stepHoldInterval={50}
              disabled={!settingsDoRejoin}
            />

            <Space h="sm" />

            <Select
              value = {settingsZoomLanguage}
              onChange={(s) => setSettingsZoomLanguage(s? s : "")}
              label="Язык Zoom"
              placeholder="Выбрать"
              data={[
                { value: 'ru', label: 'Русский' },
                { value: 'en', label: 'English' }
              ]}
              disabled={!settingsDoRejoin}
            />

            <Space h="sm" />

            <Textarea
              value={settingsZoomWindnames}
              onChange={(event) => setSettingsZoomWindnames(event.currentTarget.value)}
              spellCheck="false"
              label="Названия окон Zoom"
              //defaultValue={
              //  "\"ConfMeetingNotfiyWnd\", \"Connecting\", \"Zoom Meeting\", \"Waiting for Host\""
              //}
              disabled={!settingsDoRejoin}
            />

            <Space h="sm" />

            <NumberInput
              value={settingsRejoinConfirmAwait}
              onChange={(n) => setSettingsRejoinConfirmAwait(n ? n : 0)}
              label="Сколько ждать подтверждения перезайти"
              description="в секундах"
              min={0}
              stepHoldDelay={500}
              stepHoldInterval={50}
              disabled={!settingsDoRejoin}
            />

            <Space h="sm" />

            <NumberInput
              value={settingsDoNotRejoinEnd}
              onChange={(n) => setSettingsDoNotRejoinEnd(n ? n : 0)}
              noClampOnBlur
              label="За сколько до конца задачи не пытаться перезаходить"
              description="в минутах"
              min={1}
              stepHoldDelay={500}
              stepHoldInterval={50}
              disabled={!settingsDoRejoin}
            />

            <Divider my="xs" label="Конфликты" labelPosition="center" />
            <Checkbox
              checked={settingsKillZoom}
              onChange={(event) => setSettingsKillZoom(event.currentTarget.checked)}
              label="Убивать Zoom до начала следующей задачи"
              color="ocean-blue"
            />

            <Divider my="xs" label="Уведомления" labelPosition="center" />
            <Checkbox
              checked={settingsTaskUpdNotify}
              onChange={(event) => setSettingsTaskUpdNotify(event.currentTarget.checked)}
              label="Уведомлять об обновлении задач"
              color="ocean-blue" 
            />

            <Space h="sm" />

            <Checkbox
              checked={settingsQuestionableZoomVariant}
              onChange={(event) => setSettingsQuestionableZoomVariant(event.currentTarget.checked)}
              label="Уведомлять о нескольких вариантах Zoom данных"
              color="ocean-blue" />

            <Space h="xl" />

            <Center>
              <Button
                color="red"
                onClick={() => setSettingsShowResetConfirm(true)}>
                Сбросить настройки
              </Button>
            </Center>

            <ResetConfirm
              opened={settingsShowResetConfirm}
              toggleFunc={setSettingsShowResetConfirm}
            />
        </div>
        </ScrollArea>
        
      </Modal>
    </div>
  );
}

export default SettingsWindow;