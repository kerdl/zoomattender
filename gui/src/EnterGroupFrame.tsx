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
  Autocomplete,
  TextInput
} from '@mantine/core';
import { useState } from 'react';
import { Sausage, ArrowRight } from 'tabler-icons-react';
import { GroupInput } from './CommonElement';

function EditGroupFrame(props: any) {
    return (
      <div>
        <Center>
          <Text 
            color="gray"
          >
          Введи свою группу
          </Text>
        </Center>
        <Space h='sm' />
        <Center>
          <GroupInput 
            putError={false}
            icon={<Sausage size={18} />}
            fullTasksContent={props.fullTasksContent} 
            value={props.settingsGroupType} 
            onChange={props.setSettingsGroupType}
          />
        </Center>
      </div>
    );
}

export {EditGroupFrame};