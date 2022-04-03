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
  LoadingOverlay,
  Overlay,
  Modal,
  Select,
  Stepper,
  Group,
  TextInput
} from '@mantine/core';
import {useState} from 'react';
import {ArrowRight} from 'tabler-icons-react';

function getAllGroups(groups: any) {
  let result = [];
  for (let i in groups) {
      result.push(groups[i].group);
  }
  return result; 
}

function EditGroupFrame(props: any) {
    function switchGroupInput() {
        props.setSettingsGroupSelect((o: any) => typeof o == 'string' ? null : "");
        props.setSettingsGroupType((o: any) => typeof o == 'string' ? null : "");
    }

    return (
      <div>
        <Center>
          <Text 
            color="gray"
          >
          {typeof props.settingsGroupSelect == "string" ? "Выбери свою группу" : "Введи свою группу"}
          </Text>
        </Center>
        <Space h='sm' />
        <Center>
          {typeof props.settingsGroupSelect == "string" && props.tasks && <Select 
            data={getAllGroups(props.tasks.groups)}
            value={props.settingsGroupSelect}
            onChange={(v) => props.setSettingsGroupSelect(v)}
            placeholder="Группа"/>}
          {typeof props.settingsGroupType == "string" && <TextInput
            value={props.settingsGroupType}
            onChange={(e) => props.setSettingsGroupType(e.target.value)}
            placeholder="Группа"
            />}
        </Center>
        <Space h='sm' />
        <Center>
          <Button 
            compact 
            color="gray" 
            variant="subtle"
            onClick={() => {switchGroupInput()}}
          >
          {typeof props.settingsGroupSelect == "string" ? "Ввести группу" : "Выбрать группу"}
          </Button>
        </Center>
      </div>
    );
}

export {EditGroupFrame};