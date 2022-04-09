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

// tasks //
interface zoomDataInnerSchema {
    id: string,
    pwd: string
}

interface zoomDataSchema {
    name: string,
    data: zoomDataInnerSchema
}

interface tasksSchema {
    name: string,
    start: string,
    end: string,
    zoom_data: zoomDataSchema
}

interface groupSchema {
    group: string,
    tasks: tasksSchema
}

interface tasksSchema {
    groups: groupSchema
}

// local tasks //
interface localTaskSchema {
    enabled: boolean,
    name: string,
    start: string,
    end: string,
    id: string,
    pwd: string | null
}

interface localTasksSchema {
    tasks: Array<localTaskSchema>
}

export type settings = settingsSchema;
export type prefs = prefsSchema;
export type tasks = tasksSchema;
export type local_tasks = localTasksSchema;