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
    const [settingsGroupSelect, setSettingsGroupSelect] = useState<null | string>("");
    const [settingsGroupType, setSettingsGroupType] = useState<null | string>(null);

    function switchGroupInput() {
        setSettingsGroupSelect((o) => typeof o == 'string' ? null : "");
        setSettingsGroupType((o) => typeof o == 'string' ? null : "");
    }

    return (
      <div>
        <Center>
          <Text 
            color="gray"
          >
          {settingsGroupSelect == "" ? "Выбери свою группу" : "Введи свою группу"}
          </Text>
        </Center>
        <Space h='sm' />
        <Center>
          {settingsGroupSelect == "" && props.tasks && <Select 
            data={getAllGroups(props.tasks.groups)}
            value={settingsGroupSelect}
            placeholder="Группа"/>}
          {settingsGroupType == "" && <TextInput
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
          {settingsGroupSelect == "" ? "Ввести группу" : "Выбрать группу"}
          </Button>
        </Center>
      </div>
    );
}

export {EditGroupFrame};