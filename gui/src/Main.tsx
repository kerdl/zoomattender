import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { InitialSetupWindow } from './InitialSetupWindow';
import { Menu } from './Menu';
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
  Modal, 
  Center,
  MantineProvider,
  LoadingOverlay

} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import {settings, prefs, tasks} from './JsonSchemas';
import { updateRequest, loadSettings, loadPrefs, loadWindnames } from './BackendHelpers';

const Main = function Main() {
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [updateInProcess, setUpdateInProcess] = useState(false);

  const [tasksContent, setTasksContent] = useState<null | tasks | boolean>(null);
  const [settingsContent, setSettingsContent] = useState<null | settings>(null);
  const [prefsContent, setPrefsContent] = useState<null | prefs>(null);
  const [windnamesContent, setWindnamesContent] = useState<null | any>(null);
  
  useEffect(() => {
    async function _loadSettings() {
      const _s = await loadSettings();
      setSettingsContent(_s);
        if (
          _s && 
          (!_s.tasks.group || 
          !_s.rejoin.zoom_language))
          setShowInitialSetup(true);
      }

    async function _loadPrefs() {
      const _p = await loadPrefs();
      setPrefsContent(_p);
    }

    async function _loadWindnames() {
      const _w = await loadWindnames();
      setWindnamesContent(_w);
    }

    _loadSettings();
    _loadPrefs();
    _loadWindnames();
  
  }, [])

  return (
    <NotificationsProvider position='top-center' containerWidth={350}>
      <LoadingOverlay 
        visible={settingsContent && prefsContent ? false : true}
        overlayOpacity={1} 
        overlayColor="#1e1e1e"/>
      <div>
        {showInitialSetup && <InitialSetupWindow 
          toggleFunc={setShowInitialSetup}
          langs={windnamesContent}
          tasksContent={tasksContent}
          setTasksContent={setTasksContent}
          settingsContent={settingsContent}
          setSettingsContent={setSettingsContent}
          setShowInitialSetup={setShowInitialSetup}/>}
        {!showInitialSetup && <Menu 
          tasks={tasksContent}
          setTasks={setTasksContent}
          settingsContent={settingsContent}
          setSettingsContent={setSettingsContent}
          setShowInitialSetup={setShowInitialSetup}/>}
      </div>
    </NotificationsProvider>


  );
}

export {Main};