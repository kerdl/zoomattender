# What's this?
A Tauri app that creates tasks for attending online classes.

# Why?
1. None of the solutions I saw had an option to rejoin meetings.
My college uses free 40-minutes meetings and everyone has
to manually rejoin the class after this limit is exceeded.
I hate waking up at 8:30 AM, so I decided to make this 
thing that does most stuff for me.

2. My schedule is inconstant, changes every week.
I've made a schedule parser long time ago and now
this is a key thing here: it edits tasks content
on API server and the client fetches them.

# How rejoin works
1. Using EnumWindows to get all running
windows (in a loop with 1 second sleep);
2. Checking: 
* if even one window from [here](https://github.com/kerdl/zoomattender/blob/fde28a5ea47e02472095401c54c8572729ea4f32/src/mappings/windnames.rs#L35) 
is in this enum,
* if overall checked window name is not longer
than `target_window.len() + 3`;
3. If everything is great, 
continue iterating on and on,
else continue iterating only up to 3 times,
and if none of them were still found, pop up
a rejoin confirm window.

It could just go and instantly rejoin,
but we don't know if Zoom was closed
by the user or the meeting has really ended.

# How to make a use from it
Dunno... If your situation is same as mine,
you could try creating a fork, editing an [API response
schema](https://github.com/kerdl/zoomattender/blob/master/src/mappings/tasks.rs), 
adapting a new schema, 
making your own schedule parser, running your own HTTP API server,
translating this thing to English and fixing my bullshit.
GUI codebase is a complete disaster.

And sorry, no English comments. Figure everything out yourself.

This documentation may be useful,
but prepare a translator: 
https://vk.com/@ktmuslave-zoomattender
