// settings //
interface settingsSchema {
    tasks: {
      api_url: string,
      group: string | null
    },
    zoom: {
      zoom_path: string
    },
    rejoin: {
      do_rejoin: boolean,
      do_not_watch: number,
      max_no_windows: number,
      zoom_language: string | null,
      rejoin_confirm_await: number,
      do_not_rejoin_end: number
    },
    conflicts: {
      kill_zoom: boolean
    },
    notifications: {
      task_upd_notify: boolean,
      questionable_zoom_variant: boolean
    }
}

// prefs //
interface prefsSchema {
    teachers: []
}

// full tasks //
interface fullTaskZoomDataInnerSchema {
    id: string,
    pwd: string
}

interface fullTaskZoomDataSchema {
    name: string,
    data: fullTaskZoomDataInnerSchema
}

interface fullTaskSchema {
    name: string,
    start: string,
    end: string,
    zoom_data: Array<fullTaskZoomDataSchema>
}

interface fullTaskGroupSchema {
    group: string,
    tasks: fullTaskSchema
}

interface fullTasksSchema {
    groups: fullTaskGroupSchema
}

// local tasks //
interface localTaskSchema {
    enabled: boolean,
    name: string,
    description: fullTaskSchema,
    start: string,
    end: string,
    id: string,
    pwd: string | null
}

interface localTasksSchema {
    tasks: localTaskSchema[]
}

export type settings = settingsSchema;
export type prefs = prefsSchema;
export type fullTasks = fullTasksSchema;
export type fullTask = fullTaskSchema;
export type localTasks = localTasksSchema;
export type localTask = localTaskSchema;