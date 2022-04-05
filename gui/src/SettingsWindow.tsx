import {
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
  ScrollArea,
  Notification,
  Text,
  Dialog,
  Modal,
  Container,
  ActionIcon,
  Transition,
  Group
} from '@mantine/core';
import { Api, Sausage, DirectionHorizontal, Language, Clock, Check, X } from 'tabler-icons-react';
import React, { useEffect, useState } from 'react';
import { GroupInput } from './CommonElement';
import { settings } from './JsonSchemas';
import { motion } from "framer-motion";
import { fetchTasks, getAllGroups, loadSettings, saveSettings } from './BackendHelpers';
import { invoke } from '@tauri-apps/api/tauri';

function NotAllSatisfied(props: any) {
  return (
    <Modal
      centered
      title="ыъбъыъь"
      opened={props.opened}
      onClose={() => props.closeFunc()}>

      Не все поля заполнены правильно

    </Modal>
  );
}

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
          onClick={async () => {
            await invoke('reset_settings');
            window.location.reload();
          }}>
          Сбросить
        </Button>
      </Center>
    </Modal>
  )
}

const SettingsWindow = function SettingsWindow(props: any) {
  let c: settings = props.content;
  const [settingsApiUrl, setSettingsApiUrl] = useState(c ? c.tasks.api_url : "");

  const [settingsGroupSelect, setSettingsGroupSelect] = useState<string | null>(
    c && c.tasks.group ? c.tasks.group : "");
  const [showGroupSelect, setShowGroupSelect] = useState(false);
  const [settingsGroupType, setSettingsGroupType] = useState<string>(
    c && c.tasks.group ? c.tasks.group : "");
  const [showGroupType, setShowGroupType] = useState(true);

  const [settingsZoomPath, setSettingsZoomPath] = useState(c ? c.zoom.zoom_path : "");
  const [settingsDoRejoin, setSettingsDoRejoin] = useState(c ? c.rejoin.do_rejoin : false);
  const [settingsDoNotWatch, setSettingsDoNotWatch] = useState(c ? c.rejoin.do_not_watch : 0);
  const [settingsMaxNoWindows, setSettingsMaxNoWindows] = useState(c ? c.rejoin.max_no_windows : 0);
  const [settingsZoomLanguage, setSettingsZoomLanguage] = useState(c ? c.rejoin.zoom_language : "");
  //const [settingsZoomWindnames, setSettingsZoomWindnames] = useState(c ? c.rejoin.zoom_windnames : "");
  const [settingsRejoinConfirmAwait, setSettingsRejoinConfirmAwait] = useState(c ? c.rejoin.rejoin_confirm_await : 0);
  const [settingsDoNotRejoinEnd, setSettingsDoNotRejoinEnd] = useState(c ? c.rejoin.do_not_rejoin_end : 0);
  const [settingsKillZoom, setSettingsKillZoom] = useState(c ? c.conflicts.kill_zoom : false);
  const [settingsTaskUpdNotify, setSettingsTaskUpdNotify] = useState(c ? c.notifications.task_upd_notify : false);
  const [settingsQuestionableZoomVariant, setSettingsQuestionableZoomVariant] = useState(c ? c.notifications.questionable_zoom_variant : false);

  const [showNotAllSatisfied, setShowNotAllSatisfied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false)


  const required = [
    !!settingsApiUrl,
    settingsGroupType.length == 6,
    !!settingsZoomPath,
    settingsDoRejoin ? !!settingsZoomLanguage : true,
    settingsDoRejoin ? !!settingsDoNotWatch : true,
    settingsDoRejoin ? !!settingsMaxNoWindows : true,
    settingsDoRejoin ? !!settingsRejoinConfirmAwait : true,
    settingsDoRejoin ? !!settingsDoNotRejoinEnd : true,
  ];

  function switchGroupInput() {
    setShowGroupSelect((o) => !o);
    setShowGroupType((o) => !o);
  }

  useEffect(() => {
    if (showGroupSelect && !props.tasks) {
      fetchTasks(settingsApiUrl).then((tasks) => {
        props.setTasks(tasks);
      });
    }
  }, [showGroupSelect])

  function convertSettings() {
    let settings: settings = {
      tasks: {
        api_url: settingsApiUrl,
        group: showGroupSelect ? settingsGroupSelect : settingsGroupType,
      },
      zoom: {
        zoom_path: settingsZoomPath
      },
      rejoin: {
        do_rejoin: settingsDoRejoin,
        do_not_watch: settingsDoNotWatch,
        max_no_windows: settingsMaxNoWindows,
        zoom_language: settingsZoomLanguage,
        //zoom_windnames: settingsZoomWindnames,
        rejoin_confirm_await: settingsRejoinConfirmAwait,
        do_not_rejoin_end: settingsDoNotRejoinEnd
      },
      conflicts: {
        kill_zoom: settingsKillZoom
      },
      notifications: {
        task_upd_notify: settingsTaskUpdNotify,
        questionable_zoom_variant: settingsQuestionableZoomVariant
      }
    }
    return settings;
  }

  function _saveSettings() {
    if (required.every(v => v == true)) {
      let newSettings = convertSettings();
      saveSettings(newSettings);
    }
    else {
      setShowNotAllSatisfied(true)
    }
  }

  function _rollbackSettings() {
    setSettingsApiUrl(c.tasks.api_url);
    setSettingsGroupSelect(c.tasks.group);
    setSettingsGroupType(c && c.tasks.group ? c.tasks.group : "");
    setSettingsZoomPath(c.zoom.zoom_path);
    setSettingsDoRejoin(c.rejoin.do_rejoin);
    setSettingsDoNotWatch(c.rejoin.do_not_watch);
    setSettingsMaxNoWindows(c.rejoin.max_no_windows);
    setSettingsZoomLanguage(c.rejoin.zoom_language);
    setSettingsRejoinConfirmAwait(c.rejoin.rejoin_confirm_await);
    setSettingsDoNotRejoinEnd(c.rejoin.do_not_rejoin_end);
    setSettingsKillZoom(c.conflicts.kill_zoom);
    setSettingsTaskUpdNotify(c.notifications.task_upd_notify);
    setSettingsQuestionableZoomVariant(c.notifications.questionable_zoom_variant);
  }

  return (
    <Modal
      centered
      title="Настройки"
      opened={props.settingsOpened}
      onClose={() => {props.setSettingsOpened(false)}}>
      <Center>
        <Container>
          <NotAllSatisfied
            opened={showNotAllSatisfied}
            closeFunc={setShowNotAllSatisfied}
          />
          <ScrollArea style={{ height: 370, width: 420 }}>
            <Container
              style={{
                marginRight: 15,
                marginLeft: 15
              }}>
              <Divider my="xs" label="Задачи" labelPosition="center" />
              <TextInput
                required
                icon={<Api size={18} />}
                label="API"
                value={settingsApiUrl}
                error={settingsApiUrl.length <= 0 ? true : false}
                onChange={(event) => setSettingsApiUrl(event.currentTarget.value)}
              />

              <Space h='sm' />

              <GroupInput
                icon={<Sausage size={18} />}
                tasks={props.tasks}
                value={settingsGroupType}
                onChange={setSettingsGroupType}
                label="Группа" />

              <Divider my="xs" label="Zoom" labelPosition="center" />
              <TextInput
                required
                icon={<DirectionHorizontal size={20} />}
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

              <Select
                required
                icon={<Language size={18} />}
                value={settingsZoomLanguage}
                onChange={(s) => setSettingsZoomLanguage(s ? s : "")}
                error={settingsZoomLanguage && settingsZoomLanguage.length <= 0 ? true : false}
                label="Язык Zoom"
                placeholder="Выбрать"
                data={[
                  { value: 'ru', label: 'Русский' },
                  { value: 'en', label: 'English' }
                ]}
                disabled={!settingsDoRejoin}
              />

              <Space h="sm" />

              <NumberInput
                required
                icon={<Clock size={18} />}
                value={settingsMaxNoWindows}
                onChange={(n) => setSettingsMaxNoWindows(n ? n : 0)}
                error={settingsMaxNoWindows == null || settingsMaxNoWindows < 0 ? true : false}
                label="Максимальное время отсутствия окон Zoom"
                description="в секундах"
                min={1}
                stepHoldDelay={500}
                stepHoldInterval={50}
                disabled={!settingsDoRejoin}
              />

              <Space h="sm" />

              <NumberInput
                required
                icon={<Clock size={18} />}
                value={settingsDoNotWatch}
                onChange={(n) => setSettingsDoNotWatch(n ? n : 0)}
                error={settingsDoNotWatch == null || settingsDoNotWatch < 0 ? true : false}
                label="Отсрочка слежения за окнами Zoom"
                description="в секундах"
                min={1}
                stepHoldDelay={500}
                stepHoldInterval={50}
                disabled={!settingsDoRejoin}
              />

              <Space h="sm" />

              <NumberInput
                required
                icon={<Clock size={18} />}
                value={settingsRejoinConfirmAwait}
                onChange={(n) => setSettingsRejoinConfirmAwait(n ? n : 0)}
                error={settingsRejoinConfirmAwait == null || settingsRejoinConfirmAwait < 0 ? true : false}
                label="Сколько ждать подтверждения перезайти"
                description="в секундах"
                min={0}
                stepHoldDelay={500}
                stepHoldInterval={50}
                disabled={!settingsDoRejoin}
              />

              <Space h="sm" />

              <NumberInput
                required
                icon={<Clock size={18} />}
                value={settingsDoNotRejoinEnd}
                onChange={(n) => setSettingsDoNotRejoinEnd(n ? n : 0)}
                error={settingsDoNotRejoinEnd == null || settingsDoNotRejoinEnd < 0 ? true : false}
                noClampOnBlur
                label="За сколько до конца не пытаться перезаходить"
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

              <ResetConfirm
                opened={showResetConfirm}
                toggleFunc={setShowResetConfirm}
                setContent={props.setContent}
                setShowInitialSetup={props.setShowInitialSetup}
              />
            </Container>
          </ScrollArea>
          <Space h={20} />
          <Center>
            <Group>
              <Button
                compact
                color='red'
                onClick={() => setShowResetConfirm(true)}>
                <Text weight={30} size='sm'>Сбросить</Text>
              </Button>
              <Button
                compact
                color='gray'
                onClick={() => _rollbackSettings()}>
                <Text weight={30} size='sm'>Отменить</Text>
              </Button>
              <Button
                compact
                color='blue'
                onClick={() => { _saveSettings() }}>
                <Text weight={30} size='sm'>Сохранить</Text>
              </Button>
            </Group>
          </Center>
        </Container>
      </Center>
    </Modal>
  );
}

export default SettingsWindow;