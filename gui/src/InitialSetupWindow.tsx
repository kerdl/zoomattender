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
    Container,
    TextInput
} from '@mantine/core';
import {useState} from 'react';
import {ArrowRight} from 'tabler-icons-react';
import { EditGroupFrame } from './EnterGroupFrame';
import { EnterZoomLanguageFrame } from './EnterZoomLanguageFrame';
import { FinishSetup } from './FinishSetup';


const InitialSetupWindow = function InitialSetupWindow(props: any) {
    const [settingsGroupSelect, setSettingsGroupSelect] = useState<null | string>("");
    const [settingsGroupType, setSettingsGroupType] = useState<null | string>(null);
    const [settingsZoomLanguage, setSettingsZoomLanguage] = useState<null | string>("ru");

    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
      <>
        <Container size={400} style={{marginTop: "100px"}}>
          <Stepper 
            active={active} 
            onStepClick={setActive} 
          >
            <Stepper.Step label="Группа">
              <Space h={80}/>
              <EditGroupFrame 
                tasks={props.tasks}
                settingsGroupSelect={settingsGroupSelect}
                settingsGroupType={settingsGroupType}
                setSettingsGroupSelect={setSettingsGroupSelect}
                setSettingsGroupType={setSettingsGroupType} />
            </Stepper.Step>
            <Stepper.Step label="Язык Zoom">
              <Space h={80}/>
              <EnterZoomLanguageFrame 
                nextStep={nextStep}
                settingsZoomLanguage={settingsZoomLanguage}
                setSettingsZoomLanguage={setSettingsZoomLanguage} />
            </Stepper.Step>
            <Stepper.Completed>
              <Space h={90}/>
              <FinishSetup toggleFunc={props.toggleFunc}/>
            </Stepper.Completed>
          </Stepper>
          <Center>
          <Container style={{
            position: 'absolute', 
            bottom: '0px',
            marginBottom: '100px'
          }}>
            <Group position="center" mt="xl">
              <Button 
                variant="default" 
                onClick={prevStep}
                disabled={active==0}>
                Назад
              </Button>
              <Button 
                onClick={nextStep}
                disabled={active==2}>
                Далее
              </Button>
            </Group>
          </Container>
          </Center>
        </Container>
      </>
    );
}

export {InitialSetupWindow}