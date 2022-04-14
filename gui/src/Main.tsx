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
import { WatchRejoinConfirm } from './WatchRejoinConfirm';


function Main() {
  const [session, setSession] = useState("");
  const [initialState, setInitialState] = useState("");
  const [timeout, setTimeout] = useState<null | number>(null);

  const [showInitialSetup, setShowInitialSetup] = useState(false);
  const [fromInitialSetup, setFromInitialSetup] = useState(false);

  const [fullTasksContent, setFullTasksContent] = useState<null | fullTasks>(null);
  const [localTasksContent, setLocalTasksContent] = useState<null | localTasks>(null);
  const [settingsContent, setSettingsContent] = useState<null | settings>(null);
  const [prefsContent, setPrefsContent] = useState<null | prefs>(null);
  const [windnamesContent, setWindnamesContent] = useState<null | any>(null);

  invoke('initial_state').then((s) => {if (typeof s == "string") setInitialState(s)});

  function doDisplayLoader() {
    if (session == "client") {
      return (
        settingsContent && 
        prefsContent && 
        localTasksContent ? 
        false : true
      );
    }
    else if (session == "watch") {
      return (
        timeout != null ? false : true
      );
    }
    else {
      return true
    }
  }

  async function _getSession() {
    const _s = await invoke('session');
    if (typeof _s === "string") {
      console.log('Session:', _s);
      setSession(_s)
    };
  }

  async function _getTimeout() {
    const _t = await invoke('timeout');
    if (typeof _t === "number") {
      console.log('Timeout:', _t);
      setTimeout(_t)
    };
  }

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

    setLocalTasksContent(outer);
    console.log('Tasks from scheduler loaded');
  }

  useEffect(() => {
    _getSession();
  }, [])

  useEffect(() => {
    if (session === "client") {
      _loadSettings();
      _loadPrefs();
      _loadWindnames();
      _getTasksFromScheduler(); 
    }
    else if (session === "watch") {
      _getTimeout();
    }
  }, [session])

  return (
    <NotificationsProvider position='top-center' containerWidth={350}>
      <LoadingOverlay 
        visible={doDisplayLoader()}
        overlayOpacity={1} 
        overlayColor="#1e1e1e"/>

      {session === "watch" && <WatchRejoinConfirm 
        timeout={timeout}
        setTimeout={setTimeout}
      />}

      {session === "client" && showInitialSetup && <InitialSetupWindow 
        toggleFunc={setShowInitialSetup}
        langs={windnamesContent}

        fullTasksContent={fullTasksContent}
        setFullTasksContent={setFullTasksContent}

        settingsContent={settingsContent}
        setSettingsContent={setSettingsContent}
        
        setShowInitialSetup={setShowInitialSetup}/>}

      {session === "client" && !showInitialSetup && <Menu 
        initialState={initialState}
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