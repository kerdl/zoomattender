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

# How to make a use from it
Dunno... If your situation is same as mine,
you could try creating a fork, editing an API response
schema `(./src/mappings/tasks.rs)`, adapting a new schema, 
translating this thing to English and fixing my bullshit.
GUI codebase is a complete disaster.

And sorry, no English comments. Figure everything out yourself.
