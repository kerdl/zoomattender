import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { InitialSetupWindow } from './InitialSetupWindow';
import {Menu} from './Menu';
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
  LoadingOverlay

} from '@mantine/core';
import {settings, prefs, tasks} from './JsonSchemas';
import { updateRequest } from './BackendHelpers';

const Main = function Main() {
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [updateInProcess, setUpdateInProcess] = useState(false);
  const [tasksContent, setTasksContent] = useState<null | tasks>(null);
  const [settingsContent, setSettingsContent] = useState<null | settings>(null);
  const [prefsContent, setPrefsContent] = useState<null | prefs>(null);
  const [windnamesContent, setWindnamesContent] = useState<null | any>(null);

  useEffect(() => {
    async function fetchTasks() {
      if (settingsContent) {
        const _data = await fetch(settingsContent.tasks.api_url);
        const _json = await _data.json()
        setTasksContent(_json);
        console.log('Tasks fetched');
      }
    }
    fetchTasks();
  }, [settingsContent])
  
  useEffect(() => {
    async function LoadSettings() {
      const _s = await invoke('load_settings');
      if (typeof _s == 'string') {
        const _json = JSON.parse(_s);
        setSettingsContent(_json);
        console.log('Settings loaded');
        if (
          _json && 
          (!_json.tasks.group || 
          !_json.rejoin.zoom_language))
          setShowInitialSetup(true);
      }
    }

    async function loadPrefs() {
      const _p = await invoke('load_prefs');
      if (typeof _p == 'string') {
        setPrefsContent(JSON.parse(_p));
      }
    }

    async function loadWindnames() {
      const _w = await invoke('load_windnames');
      if (typeof _w == 'string') {
        setWindnamesContent(JSON.parse(_w));
        console.log('Windnames loaded');
      }
    }

    LoadSettings();
    loadPrefs();
    loadWindnames();
  
  }, [])

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

  return (
    <>
      <LoadingOverlay 
        visible={settingsContent && prefsContent && tasksContent ? false : true}
        overlayOpacity={1} 
        overlayColor="#1e1e1e"/>
      <div>
        {showInitialSetup && <InitialSetupWindow 
          tasks={tasksContent} 
          toggleFunc={setShowInitialSetup}
          langs={windnamesContent}
          settingsContent={settingsContent}
          setSettingsContent={setSettingsContent}
          setShowInitialSetup={setShowInitialSetup}/>}
        {!showInitialSetup && <Menu 
          settingsContent={settingsContent}
          setShowInitialSetup={setShowInitialSetup}/>}
      </div>
    </>


  );
}

export {Main};