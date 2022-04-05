import { settings } from './JsonSchemas';
import { invoke } from '@tauri-apps/api/tauri';

async function fetchTasks(apiUrl: string) {
    const _data = await fetch(apiUrl);
    const _json = await _data.json();
    console.log('Tasks fetched');
    return _json;
}

async function updateRequest() {
    return new Promise(resolve => setTimeout(resolve, 2000, "content"))
}

async function loadSettings() {
    const _s = await invoke('load_settings');
    if (typeof _s == 'string') {
      const _json = JSON.parse(_s);
      console.log('Settings loaded');
      return _json;
    }
}

function saveSettings(content: settings) {
    invoke('save_settings', {settings: JSON.stringify(content)})
        .then(() => console.log('Settings saved'))
}

async function loadPrefs() {
    const _p = await invoke('load_prefs');
    if (typeof _p == 'string') {
      const _json = JSON.parse(_p);
      console.log('Prefs loaded');
      return _json;
    }
}

async function loadWindnames() {
    const _w = await invoke('load_windnames');
    if (typeof _w == 'string') {
      const _json = JSON.parse(_w);
      console.log('Windnames loaded');
      return _json;
    }
}

function getAllGroups(groups: any) {
    let result = [];
    for (let i in groups) {
        result.push(groups[i].group);
    }
    return result; 
}

function getLanguages(langs: any) {
    let result = [];
    let langKeys = Object.keys(langs);
    for (const lang in langKeys) {
        let _json: any = {};
        _json.value = langKeys[lang];
        _json.label = langs[langKeys[lang]].label;
        result.push(_json);
    }
    return result; 
}

export { fetchTasks, updateRequest, loadSettings, saveSettings, loadPrefs, loadWindnames, getAllGroups, getLanguages };