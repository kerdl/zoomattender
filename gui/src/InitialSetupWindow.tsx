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
import { useState, useEffect } from 'react';
import { CircleX } from 'tabler-icons-react';
import { EditGroupFrame } from './EnterGroupFrame';
import { EnterZoomLanguageFrame } from './EnterZoomLanguageFrame';
import { FinishSetup } from './FinishSetup';
import { settings } from './JsonSchemas';
import { fetchTasks } from './BackendHelpers';

function modifySettings(
    original: settings, 
    group: string | null, 
    zoomLanguage: string | null, 
    doRejoin: boolean
) {
    original.tasks.group = group;
    original.rejoin.zoom_language = zoomLanguage;
    original.rejoin.do_rejoin = doRejoin;
    return original
}

function InitialSetupWindow(props: any) {
    const [settingsGroupSelect, setSettingsGroupSelect] = useState<null | string>("");
    const [settingsGroupType, setSettingsGroupType] = useState<null | string>(null);
    const [settingsZoomLanguage, setSettingsZoomLanguage] = useState<null | string>("ru");
    const [settingsDoRejoin, setSettingsDoRejoin] = useState(true);

    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    useEffect(() => {
      if (props.settingsContent && !props.fullTasksContent) { 
        fetchTasks(props.settingsContent.tasks.api_url)
          .then(tasks => {props.setFullTasksContent(tasks)})
      }
    }, [props.settingsContent])

    return (
      <>
        <Container size={400} style={{marginTop: "100px"}}>
          <Stepper 
            active={active} 
            onStepClick={setActive} 
          >
            <Stepper.Step 
              label="Группа" 
              description={
                settingsGroupSelect ? 
                settingsGroupSelect?.substring(6, 0) : 
                settingsGroupType?.substring(6, 0)}
              color={!settingsGroupSelect && !settingsGroupType ? "red" : "blue"}
              completedIcon={!settingsGroupSelect && !settingsGroupType ? <CircleX /> : null}>
              <Space h={80}/>
              <EditGroupFrame 
                fullTasksContent={props.fullTasksContent}
                settingsGroupSelect={settingsGroupSelect}
                settingsGroupType={settingsGroupType}
                setSettingsGroupSelect={setSettingsGroupSelect}
                setSettingsGroupType={setSettingsGroupType} />
            </Stepper.Step>
            <Stepper.Step 
              label="Язык Zoom"
              description={
                props.langs && settingsZoomLanguage && settingsDoRejoin ? 
                props.langs[settingsZoomLanguage].label : "Откл."
              }
              color={settingsDoRejoin && !settingsZoomLanguage ? "red" : "blue"}
              completedIcon={settingsDoRejoin && !settingsZoomLanguage ? <CircleX /> : null}>
              <Space h={80}/>
              <EnterZoomLanguageFrame 
                nextStep={nextStep}
                settingsZoomLanguage={settingsZoomLanguage}
                setSettingsZoomLanguage={setSettingsZoomLanguage} 
                settingsDoRejoin={settingsDoRejoin}
                setSettingsDoRejoin={setSettingsDoRejoin}
                langs={props.langs}/>
            </Stepper.Step>
            <Stepper.Completed>
              <Space h={90}/>
              <FinishSetup 
                toggleFunc={props.toggleFunc}
                modifiedContent={modifySettings(
                  props.settingsContent, 
                  settingsGroupSelect ? settingsGroupSelect : settingsGroupType, 
                  settingsZoomLanguage, 
                  settingsDoRejoin
                )}
                setSettingsContent={props.setSettingsContent}
                setShowInitialSetup={props.setShowInitialSetup}
                allDone={
                  (settingsGroupSelect || settingsGroupType) 
                  && 
                  (settingsZoomLanguage || !settingsDoRejoin)}
              />
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