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
import { settings, prefs, fullTasks, localTasks, localTask } from './JsonSchemas';
import { loadSettings, loadPrefs, loadWindnames } from './BackendHelpers';


function Main() {
  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [fromInitialSetup, setFromInitialSetup] = useState(false);

  const [fullTasksContent, setFullTasksContent] = useState<null | fullTasks>(null);
  const [localTasksContent, setLocalTasksContent] = useState<null | localTasks>(null);
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
          setShowInitialSetup(true)
          setFromInitialSetup(true);
      }

    async function _loadPrefs() {
      const _p = await loadPrefs();
      setPrefsContent(_p);
    }

    async function _loadWindnames() {
      const _w = await loadWindnames();
      setWindnamesContent(_w);
    }

    async function _getTasksFromScheduler() {
      console.log('Getting tasks from scheduler');
      const _t: any = await invoke('get_tasks_from_scheduler');
      let outer = JSON.parse(_t);

      for (let i = 0; i < outer.tasks.length; i++) {
        const t = outer.tasks[i];
        outer.tasks[i].description = JSON.parse(t.description);
      }
      console.log()

      setLocalTasksContent(outer);
      console.log('Tasks from scheduler loaded');
    }

    _loadSettings();
    _loadPrefs();
    _loadWindnames();
    _getTasksFromScheduler();
  
  }, [])

  return (
    <NotificationsProvider position='top-center' containerWidth={350}>
      <LoadingOverlay 
        visible={
          settingsContent && 
          prefsContent && 
          localTasksContent ? 
          false : true
        }
        overlayOpacity={1} 
        overlayColor="#1e1e1e"/>
      {showInitialSetup && <InitialSetupWindow 
        toggleFunc={setShowInitialSetup}
        langs={windnamesContent}

        fullTasksContent={fullTasksContent}
        setFullTasksContent={setFullTasksContent}

        settingsContent={settingsContent}
        setSettingsContent={setSettingsContent}
        
        setShowInitialSetup={setShowInitialSetup}/>}
      {!showInitialSetup && <Menu 
        langs={windnamesContent}
        fromInitialSetup={fromInitialSetup}

        fullTasksContent={fullTasksContent}
        setFullTasksContent={setFullTasksContent}
        localTasksContent={localTasksContent}
        setLocalTasksContent={setLocalTasksContent}

        settingsContent={settingsContent}
        setSettingsContent={setSettingsContent}

        prefsContent={prefsContent}
        setPrefsContent={setPrefsContent}

        setShowInitialSetup={setShowInitialSetup}/>}
    </NotificationsProvider>
  );
}

export {Main};