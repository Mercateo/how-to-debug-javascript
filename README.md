# How to debug JavaScript?

> If you're happy using `console` clap your hands! 👏

I know there are many tutorials about this topic on the internet. However I still get asked this question quite a lot from non JavaScript developers whenever they need to write some JavaScript code: _"How do I actually debug my JavaScript code?"_

I guess they ask, because they found old resources about this topic or they found resources which use a different tooling or they found a tutorial for debugging JavaScript inside the browser, but not Node or... There are probably many reasons. So here is my attempt to answer their question.

In this article you'll get

- a _short_ introduction to debugging JavaScript
- references to more in-depth explanations
- examples for debugging JavaScript in the browser _and_ in Node
- examples with and without tooling<sup>1</sup>

<sup>1</sup> Tooling refers to our setup here at [Mercateo](https://github.com/Mercateo). We use our [`ws` tool](https://github.com/Mercateo/ws) (which uses TypeScript, Babel, Webpack and more) for building our projects and many of our developers use [VS Code](https://code.visualstudio.com/) as their IDE.

You'll **not** get

- a basic introduction to JavaScript itself
- explanations about memory and performance profiling
- explanations about debugging non JavaScript stuff in your application (CSS, HTML, network...)
- explanations about configuring tools (e.g. for source map support)

# Table of contents

1. [Don't fear the `console`](#dont-fear-the-console)
    1. [A simple web project](#a-simple-web-project)
    1. [A more complex web project](#a-more-complex-web-project)
    1. [Web projects with a build setup](#web-projects-with-a-build-setup)
    1. [Logging in a Node project](#logging-in-a-node-project)
1. [Leverage breakpoints](#leverage-breakpoints)
    1. [Breakpoints in a web project](#breakpoints-in-a-web-project)
    1. [Breakpoints in a Node project or projects with a build step](#breakpoints-in-a-node-project-or-projects-with-a-build-step)
1. [Debugging in VC Code](#debugging-in-vs-code)
1. [Advanced topics](#advanced-topics)

# Don't fear the `console`

## A simple web project

Hands down. I use the `console` for 90% of my debugging needs. It just fits my habbits well and most of the time I immediatelly see what's the problem. I don't know why many people feel _bad_ about using the `console` for debugging purposes. Probably because in other programming languages printing to the console lacks a lot of features. Thankfully the console is really powerful in JavaScript - _espacially_ for browser environments.

Let's get started with a very simple example.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Debugging JavaScript</title>
</head>
<body>
  <h1>Debugging JavaScript</h1>
  <p>Open you browser dev tools to see the console output.</p>
  <script src="./index.js"></script>
</body>
</html>
```

```js
var someObject = {
  foo: {
    bar: {
      baz: 'hello'
    }
  }
};

console.log(someObject);
```

The same example can be found inside [`./browser-console`](./browser-console). Just open in the HTML with a browser of your choice and open the browser console.

💡 All mordern browsers have usually everything you need for basic debugging purposes. But this was not allways the case and some special developer tools are still better in browser _X_ than in browser _Y_. Historically _most_ developers I know use Google Chrome for debugging their applications. But I'd like to point out Firefox which has awesome developer tools as well. Espacially the debugger called [`debugger.html`](https://github.com/devtools-html/debugger.html) itself is nice, because it is a standalone web application written in React.

This is how the browser with the open console looks like in Chrome:

![chrome console](./assets/chrome-console.png)

And this is Firefox:

![firefox console](./assets/firefox-console.png)

As you can see you get the basic object printed to the console (**1**) and you can see the origin of the output (**2**) as `script-name:row(:column)`. Note that **1** and **2** are _interactive_ elements. (Also note that I'll use screens from Chrome from now on - except when I'd like to point out something special in the Forefox debugger.)

If you click on **1** you can navigate into the object and you can also see properties which we didn't added, because they are on our objects [`prototype`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain) (in this case just [`__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto)).

![chrome console](./assets/chrome-console-object.png)

If you click on **2** you'll jump to the "sources panel" in Chrome or "debugger panel" in Firefox where you can inspect the source code and create breakpoints.

![chrome sources panel](./assets/chrome-sources.png)

We'll spend more time here in the next chapter. For now let's stick with the console.

## A more complex web project

Let us swith to a more complex project now which you can find in [./browser-console-complex](./browser-console-complex) or by copying the following code:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Debugging JavaScript</title>
</head>
<body>
  <h1>Debugging JavaScript</h1>
  <p>Open you browser dev tools to see the console output.</p>

  <button id="log-element">Log element</button>
  <button id="log-time">Log time</button>

  <script src="./index.js"></script>
</body>
</html>
```

```js
var logElementButton = document.getElementById('log-element');
logElementButton.addEventListener('click', function onClick(event) {
  console.log(event, logElementButton);
  console.dir(logElementButton);
});

var logTimeButton = document.getElementById('log-time');
logTimeButton.addEventListener('click', function onClick(event) {
  var msg = 'getBoundingClientRect().height';
  console.time(msg);
  logTimeButton.getBoundingClientRect().height;
  console.timeEnd(msg)
});
```

Open the `index.html` again and click on the _"Log element"_ button. It should look like this:

![chrome log element](./assets/chrome-log-element.png)

Here we can notice a couple of things.

1. `console.log` can log as much params as you want (here: `event` and `logElementButton`).
2. The logged `event` is labeled with a descriptive `MouseEvent`, which is the name of its [constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor).
3. If you `console.log` a DOM element it is logged as "HTML markup".
4. There are multiple ways to log a variable. `console.dir` is another one which logs the DOM element as an interactive list of its properties.

That's all we can see from the screenshot alone, but there is more under the hood.

If you hover over the `console.log`ed DOM element the element will actually be highlighted in the screen, but not for `console.dir`. You can also right click on the logged DOM element (via `console.log` or `console.dir`) and click on "Reveal in Elements panel" to jump to exactly this element in the DOM view.

![chrome highlighted element](./assets/chrome-highlighted-element.png)

If you right click on the `console.dir`'ed element you can also see the option to "Store as global variable". (This should work in nearly all cases, not just for logged DOM elements. Not sure why this isn't an option in the `console.log`'ed DOM element.)

![chrome global var](./assets/chrome-global-var.png)

Now you can access this global var (in my case its called `temp1`) as often as you want in your console. For example we could just add another event listener to it and use a new console method called `count` while doing so:

```js
temp1.addEventListener('mouseover', function onHover() { console.count('hovered'); })
```

![chrome event listener](./assets/chrome-event-listener.png)

If you hover over our _"Log element"_ button you should see the new output. `count` just counts how often the line `'hovered'` was logged.

![chrome count](./assets/chrome-count.png)

If you console gets cluttered by too much output just click the stop icon in the left top corner to clear you current console (or call `console.clear()`).

![chrome clear console](./assets/chrome-clear-console.png)

Now press our _"Log time"_ button a couple of times. You should see an unput similar to this:

![chrome perf](./assets/chrome-perf.png)

As you can see we made some basic performance testing with `console.time` and `console.endTime`. While this is definitely not for complex scenarios you can already gather useful information from these methods. (E.g. we can see that `getBoundingClientRect().height` gets faster over time - probably because the data gets cached and optimized when we run this function multiple times without altering our layout.)

💡 The difference we saw in `console.log` and `console.dir` can be seen in a lot of places - not just DOM elements. In general the `log` represantation is a simpler view ("stringified") while the `dir` representation is more useful, if you wan't to do _more_ with the variable besides reading.

![chrome dir vs log](./assets/chrome-dir-vs-log.png)

💡 In many small cases Firefox behaves differently than Chrome here and other browsers will have their own distinct behaviour, too. Try out different tools and see what fits you. In Firefox the difference between `console.log` and `console.dir` is _way_ less explicit. It just alter the initial "look" of the logged variable, but we can swith between the `log` und `dir` represantation on the fly. It is also possible here to store the `console.log`'ed DOM element as a globar variable and the DOM element is highlighted when we hover of the `console.dir`'ed DOM element as well. IMHO Firefox behaviour is more usefull in these cases.

💡 Chrome dev tools offer some special functions. For example you can use `monitor(someFunction)` and every time `someFunction` is called, this will be logged to your console including all params. Or you can use `queryObjects(constructor)` to get all instances of that constructor. E.g. when you call `queryObjects(Array)` you'll get all arrays which are currently used in your application. [Read this article](http://www.sbegaudeau.com/2017/11/30/chrome-devtools-part2.html) to get more information about how to use the console.

There is much more to discover about the console alone. Checkout the official documentation about the console from [Chrome](https://developers.google.com/web/tools/chrome-devtools/console/) and [Firefox](https://developer.mozilla.org/de/docs/Web/API/Console).

## Web projects with a build setup

Many JavaScript projects use a build step. You use Webpack, TypeScript, Babel or any other compiler/transpiler/preprocessor. The point is: the code you wrote is not necessarly the code that runs inside the browser or Node. Therefor the lines you see in your logs and stack traces don't match the places where they appear in your source code. Thankfully there is a technology to solve that: [Source Maps](https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/). Source Maps an enable debugging tools to match the compiled code back to your original source code. This feature should be enabled in your tooling setup.

Just a quick example which you can find inside [./browser-console-build](./browser-console-build). This is the old example just "converted" to TypeScript and build with our [`ws` tool](https://github.com/Mercateo/ws). Install dependencies with `$ yarn` and run it with `$ yarn start`.

Now you should see your `.ts` file - **not** the `.js` file - in the console output.

![chrome browser console build](./assets/chrome-browser-console-build.png)

What the `ws` tool does is basically configure TypeScript, Babel, Webpack and co. correctly to include Source Maps in your compiled code.

## Logging in a Node project

Logging a variable inside a Node project is by default less useful than inside a browser, because the terminal just lacks the interactive features of browser developer tools. You can see the limited output if you run the following example (also available inside [./node-console](./node-console)):

```js
var someObject = {
  foo: {
    bar: {
      baz: {
        hello: 'foo'
      }
    }
  }
};

console.log(someObject);
```

```bash
$ node index.js
{ foo: { bar: { baz: [Object] } } }
```

You can hack around this by using a "pretty printer" which formats your output (occasionally `JSON.stringify(someObject, null, 2)` or `require('util').inspect(someObject, { depth: 100 })` can help here to avoid installing additional dependencies), but don't worry! We can actually use the browser developer tools we just introduced to debug Node applications as well 😍

To do that we just need to pass the `--inspect` flag to Node like this: `$ node --inspect index.js`. Now we are able to open our Chrome developer tools so they can connect to the _running_ Node program. But because our Node script immediately exits after `console.log`, we don't have enough time to do so. That's why we also need to pass the `--debug-brk` flag which sets a _breakpoint_ to our script befor it runs so we have enough time to open and configure our browser dev tools. (💡 Since Node v7 you can also use `--inspect-brk` instead of `--inspect --debug-brk`.)

Now you should see the following output:

```bash
$ node --inspect --debug-brk index.js
Debugger listening on port 9229.
Warning: This is an experimental feature and could change at any time.
To start debugging, open the following URL in Chrome:
    chrome-devtools://devtools/remote/serve_file/@60cd6e859b9f557d2312f5bf532f6aec5f284980/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/9557375c-e101-4100-ac8c-8860d8a9dca5
```

You can actually _ignore_ the URL in the output and just open [`chrome://inspect`](chrome://inspect) in you Chrome browser. You should see all available "debugging targets" - but there probably is just one target for the script you just started. Now click on _"inspect"_.

![chrome inspect](./assets/chrome-inspect.png)

You should now be in the _"sources"_ panel. Click on the blue arrow to run the program.

![chrome inspect run](./assets/chrome-inspect-run.png)

Now you can switch to the _"console"_ and you should be able to see the output from your Node program.

![chrome inspect output](./assets/chrome-inspect-output.png)

💡 Source Maps work for Node projects as well.

With `--debug-brk` we also saw the first usage of a breakpoint so let's move on to learn more about them!

# Leverage breakpoints

## Breakpoints in a web project

Now I'll introduce you to several ways how you can set breakpoints in you application. We need another example for that which you can find inside [./browser-breakpoints](./browser-breakpoints) or by copying the following code:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Debugging JavaScript</title>
</head>
<body>
  <h1>Debugging JavaScript</h1>
  <p>Open you browser dev tools to test the breakpoints.</p>

  <button id="break-debugger">Break with `debugger`</button>
  <button id="break-manually">Break manually</button>
  <button id="break-on-error">Throw error</button>

  <script src="./index.js"></script>
</body>
</html>
```

```js
var breakDebuggerButton = document.getElementById('break-debugger');
breakDebuggerButton.addEventListener('click', function onClick(event) {
  debugger;
});

var breakManuallyButton = document.getElementById('break-manually');
breakManuallyButton.addEventListener('click', function onClick(event) {
  console.log('Place a breakpoint here.');
});

var breakOnErrorButton = document.getElementById('break-on-error');
breakOnErrorButton.addEventListener('click', function onClick(event) {
  throw 'You are not allowed to click this.';
});
```

Probably the easiest way to add a breakpoint is by using `debugger;`. Just write it down wherever you want to investigate something. Very much like you used `console.log()`. If you open your dev tools and click on the _"Break with `debugger`"_ button you should see something like this:

![chrome breakpoint](./assets/chrome-breakpoint.png)

Your website grayed out and overlay appeared (_1_). When you click on the blue arrow your application continues as usual. If you click on the black arrow with the dot underneath it you'll skip the next function call (not really meaningful in this example).

You'll also see that your dev tools switched to the _"Sources"_ panel and you can see your source code with the values of some of your variables inlined (_2_, here: `event = MouseEvent`). This is even more powerful, if you hover over a variable. It will show you a nice navigatable view for your variable - very much like if you would have used `console.log`.

![chrome breakpoint hover](./assets/chrome-breakpoint-hover.png)

But one of the most powerful tools can be found on the right side (_3_). Here you can investigate the call stack or things like your current scopes. Very powerful. You should play around a little bit with this view to get the hang of everything.

Writing `debugger;` somewhere in your application isn't the only way to set a breakpoint. An alternative where you don't need to actually change the source code - and therefor can be used on just any page you browse - is by clicking on a specific line in the column left to your source code.

![chrome breakpoint hover](./assets/chrome-breakpoint-hover.png)

You can see that this line now contains a breakpoint by looking at the blue arrow. If you click on _"Break manually"_ now you'll see that your application is paused again.

There are _sooooo_ many ways to set a breakpoint. We'll have a look on two more ways, before we switch to next chapter.

Let us switch to the _"Elements"_ panel. We can create a breakpoint even here. Try to find the _"Break manually"_ button in the elements tree view. Right click on the element and go to _"Break on... > attribute modifications"_:

![chrome breakpoint elements](./assets/chrome-breakpoint-elements.png)

You'll see that a small blue dot appeared next to your element:

![chrome breakpoint elements on](./assets/chrome-breakpoint-elements-on.png)

If you write something like `document.getElementById('break-manually').setAttribute('data-foo', 'bar')` in your console now, you'll see that your application will run into your configured breakpoint, because we modified the attributes of our element.

Now to the last example which I personally use a lot: _"Pause on exceptions"_. Try to click on the _"Throw error"_ button. You should see the following error in your console:

![chrome throw error](./assets/chrome-throw-error.png)

Who hasn't seen an application which suddenly throws an error like this? 😏 Imagine this error happens deep in your application or somewhere in a framework you use. How to get to this place where the error was thrown? I'm glad you asked! Just click on the "pause" symbol in the upper right of your _"Sources"_ panel. (Note the checkbox below - we can even pause on caught exceptions, if we want to.)

![chrome breakpoint exception](./assets/chrome-breakpoint-exception.png)

If you click on the _"Throw error"_ button again you'll see our familiar paused application state. 🎉

![chrome breakpoint exception pause](./assets/chrome-breakpoint-exception-pause.png)

## Breakpoints in a Node project or projects with a build step

***TODO***

# Debugging in VS Code

***TODO***

# Advanced topics

***TODO***

---

Thank you for reading so far ♥ I hope you learned something new on the way.

If you found any errors or typos I'd be happy to get a PR.
