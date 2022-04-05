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
    Dialog,
    Autocomplete,
    AutocompleteProps,
    TextInput
} from '@mantine/core';
import { BorderRadius, Check, X } from 'tabler-icons-react';
import { tasks } from './JsonSchemas';
import { getAllGroups } from './BackendHelpers';
import { validGroup } from './Strings';

interface GroupInputProps {
    tasks: tasks,
    value: string,
    onChange: (value: string) => void,
    label?: string
    icon?: any
}
function GroupInput(props: GroupInputProps) {
    return (
      <Autocomplete
        required
        icon={props.icon}
        data={props.tasks ? getAllGroups(props.tasks.groups) : ['Получение...']}
        value={props.value}
        onChange={(v) => {
        props.onChange(validGroup(v));
        }}
        error={props.value ? props.value.length < 6 : false}
        placeholder={props.tasks ? "Группа" : "Получение..."}
        label={props.label}
      />
  );
}

export { GroupInput };