# Debugging

## Content

- [Error Messages](#error-messages)
- [Breakpoints](#breakpoints)
- [React DevTools](#react-devtools)

---

## Error Messages

Error and warning messages showed in the terminal or in the console
can already explain enough that the problem is:
```
Failed to compile.

./src/App.js
SyntaxError: App.js: Adjacent JSX elements must be wrapped in an enclosing tag.
Did you want a JSX fragment <>...</>? (43:6)

  41 |         <CourseInput onAddGoal={addGoalHandler} />
  42 |       </section>
> 43 |       <section id="goals">
     |       ^
  44 |         {content}
  45 |       </section>
  46 |
```
in this case is not allowed mote than one root, the solution is:
```javascript:
<div>
    <section id='goal-form'>
        <CourseInput onAddGoal={addGoalHandler} />
    </section>
    <section id='goals'>{content}</section>
</div>
```

## Breakpoints

It is possible to open the Browser DevTools, go to sources, open the src folder
and find for the files that gives errors.\
Then it is possible to select multiple likes of code and by clicking on the
line number create a breakpoint.\
Next time the code passes for that line, the execution will stop
and it is possible to check the current variables content and process 
step by step or breakpoint per breakpoint until the error is found.

## React DevTools

[React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
is a Chrome or Firefox extension that can be added to the browser.\
Once installed will be available two new tabs in the Browser DevTools:
- Components: show the react components' tree, not the html one.
for each component it then possible to see the children, the props value,
the hooks etc.
- Profiler: ... done later..

