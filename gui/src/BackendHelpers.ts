import { settings } from './JsonSchemas';
import { invoke } from '@tauri-apps/api/tauri';

async function updateRequest() {
    return new Promise(resolve => setTimeout(resolve, 2000, "content"))
}

function saveSettings(content: settings) {
    invoke('save_settings', {settings: JSON.stringify(content)})
        .then(() => console.log('Settings saved'))
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

export { updateRequest, saveSettings, getAllGroups, getLanguages };