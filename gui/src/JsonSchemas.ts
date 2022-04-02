var settingsSchema = {
    "tasks": {
      "api_url": "",
      "group": null
    },
    "zoom": {
      "zoom_path": ""
    },
    "rejoin": {
      "do_rejoin": true,
      "max_nowindows": 0,
      "zoom_language": null,
      "zoom_windnames": null,
      "rejoin_confirm_await": 0,
      "donot_rejoin_end": 0
    },
    "conflicts": {
      "kill_zoom": true
    },
    "notifications": {
      "task_upd_notify": false,
      "questionable_zoom_variant": true
    }
}

var prefsSchema = {
    "teachers": []
}

export {settingsSchema, prefsSchema}