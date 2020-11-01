# Slideshow component

A highly flexible slideshow component with easy controls. 

Table of Contents:

- [Import](#import)
- [Usage](#usage)
    - [Setup](#setup)
        - [The array method](#the-array-method)
        - [The amount method](#the-amount-method)
    - [Running the slideshow](#running-the-slideshow)
    - [Options](#options)
- [Advanced](#advanced)
- [Complete example](#complete-example)

## Import
JavaScript
```javascript
import slideshow from "https://unpkg.com/@bqardi/slideshow";
```

## Usage
To use the slideshow component, a few things need to be setup first.
### Setup
The slideshow needs to know which slides to slide through (or the amount of slides). It also needs to know what should happen for each slidethrough.

To setup the slideshow we need an HTML element somewhere on our webpage:

HTML:
```html
<img src="img1.jpg" id="myImg">
```

#### The array method

If we pass in an array as the first argument, the returned parameter in
the callback function (in this case `image`) contains an object with the current array-item (controlled by the slideshow) from the array passed in (`imageArray`)

JavaScript:
```javascript
var myImg = document.getElementById("myImg");
var imageArray = ["img1.jpg", "img2.jpg", "img3.jpg"];

slideshow.setup(imageArray, function(image){
    myImg.src = image.current;
});
```
##### The parameter from the callback (`image`)
The current array-item is not the only thing that is passed back through the callback:
```javascript
// Explanation example:
// If the slideshow is running and has gotten to the third item in the array
// ("img3.jpg"), then the obj (image) would look like this:
{
    index: {
        previous: 1,
        current: 2,
        next: 0
    },
    previous: "img2.jpg",
    current: "img3.jpg",
    next: "img1.jpg"
}
// In this case the value of 'image.current', from the example above,
// would be "img3.jpg".
```

The array method is highly flexible since we could create a very complex array of objects containing various properties and even methods (see the [advanced](#advanced) section for more information).

#### The amount method

We could also just pass in the amount of items we have in our array, but then the returned parameter in the callback function (in this case `index`) only contains an object with index's:

> The reason I added this 'amount' feature has to do with flexibility.
> Say we have a scenario where we want to slide through something 5 times but we don't have an `array` to iterate through, what then?
> Well, that's the main reason for this implementation where we could just pass in the number `5` as the first argument and the slideshow then takes care of the rest.

JavaScript:
```javascript
var myImg = document.getElementById("myImg");
var imageArray = ["img1.jpg", "img2.jpg", "img3.jpg"];

slideshow.setup(imageArray.length, function(index){
    myImg.src = imageArray[index.current];
});
```
##### The parameter from the callback (`index`)
The `index` -object contains the `previous`-/`current`- and `next` index:
```javascript
// Explanation example:
// If the slideshow is running and has gotten to the third item in the array
// ("img3.jpg"), then the obj (index) would look like this:
{
    previous: 1,
    current: 2,
    next: 0
}
// In this case 'imageArray[index.current]' from the example above
// can be read as 'imageArray[2]'
// and the value (at index 2 in the array) is "img3.jpg".
```

This is a very basic setup and will set the slideshow component to change the src of `myImg` every 10 seconds *(the default interval is 10s, to change it see the [options](#options) section)*.

### Running the slideshow

Now the setup is done, we need to actually do something with the slideshow:

To start the slideshow and make it change slide every 10 seconds just call:

```javascript
slideshow.start();
```
To stop it:
```javascript
slideshow.stop();
```
To toggle (between start and stop):
```javascript
slideshow.toggle();
```
To reset:
```javascript
// Resets internally:
slideshow.reset();

// If you want your callback from the setup to be executed as well:
slideshow.reset(true);
```
To pause:
```javascript
slideshow.pause();
```
To resume:
```javascript
// Can only resume from paused state:
slideshow.resume();
```
To manually show next slide:
```javascript
slideshow.next();
```
To manually show previous slide:
```javascript
slideshow.previous();
```
To manually show a specific slide:
```javascript
// Slides to the fourth item (index 3):
slideshow.goto(3);

// Slides to the first item (index 0):
slideshow.goto(0);

// Ignores any value out of range:
slideshow.goto(-1);

// Ignored if the array passed in doesn't have that many items:
slideshow.goto(57); 
```
To get the current state:
```javascript
slideshow.state;

// Can be used to check for three possible states:
if (slideshow.state === "running") {
    //Do something if the slideshow is running
}
if (slideshow.state === "paused") {
    //Do something if the slideshow is paused
}
if (slideshow.state === "stopped") {
    //Do something if the slideshow is stopped
}
```
To manually get the current progress (outside the update method)
The `threshold` -option is required (see [options](#options) below):
```javascript
// This will always return 0 if the optional
// threshold isn't set to a value greater than 0:
slideshow.progress;
```

### Options

In the 'setup' fase you can pass in an object as the third argument with your own settings:

```javascript
// Options shown with default values
var options = {
    interval: 10000,
    threshold: 0
}

slideshow.setup(images, function(image){
    myImg.src = image.current;
}, options); // Pass in `options` as the third argument
```
- The `interval` -option is the time between each slide. Just change it to, for example `5000`, and the next slide will be shown after 5 seconds.
- The `threshold` -option is a little more complicated. It can be any value above `0` and if set (to a value above `0`), it will enable an update callback that executes every `threshold` -seconds, meaning if set to, for example 0.5, will execute the `update` -method every half second. Default value is `0` (disabled).

This `update` -method is used like this:
```javascript
slideshow.update(function(progress){
    // Do something each `threshold` seconds.
});
```
The `progress` -parameter holds the progress of the current slide *(a percentage value between 0 and 1). Example: if interval is 10000 (10s) and progress has a value of 0.4 this just means the current slide has been shown for 4 seconds (40% of 10s).*

#### Example usage

The update method could be used to show a progress bar:
```html
<!-- This could just be a simple `div` -element with -->
<!-- a background-color and a fixed height: -->
<div id="progressBar" style="background-color: green; height: 4px;"></div>
```
```javascript
var progressBar = document.getElementById("progressBar");

slideshow.update(function(progress){
    progressBar.style.width = progress * 100 + "%";
    // For example: 0.4 * 100 = 40 concatenated with "%" is "40%".
    // The progressBar element is now styled with a width of 40%.
});
```

or maybe just displaying the percentage value in an element:
```html
<p id="progressText"></p>
```
```javascript
var progressText = document.getElementById("progressText");

slideshow.update(function(progress){
    progressText.textContent = progress * 100 + "%";
    // Element's textContent is now 40%:
    // <p id="progressText">40%</p>
});
```

## Advanced
The complexity of your own slideshow is entirely up to you. You can really go crazy with an advanced array full of objects containing multiple properties and even methods:

```javascript
var myArray = [
    {
        title: "My vacation",
        text: "This is <strong>me</strong> licking sun on the beach",
        src: "./images/vacation.jpg",
        alt: "Vacation in Mallorca...",
        useBehaviour: true,
        behaviour(){
            // Some fancy behaviour code here.
        }
    },
    {
        title: "At work",
        text: "Can you see how <strong>bored</strong> I am?",
        src: "./images/me-at-work.png",
        alt: "Bored at work!",
        useBehaviour: false,
        behaviour(){
            // Some fancy behaviour code here.
        }
    },
]

slideshow.setup(myArray, function(slide){
    myTitle.textContent = slide.current.title;
    myText.innerHTML = slide.current.text;

    myImg.src = slide.current.src;
    myImg.alt = slide.current.alt;

    if (slide.current.useBehaviour) {
        slide.current.behaviour();
    }
});
```
As you can see, the complexity is all up to you, the slideshow only controls the basic behaviour, like showing the next slide after a set interval, stopping/starting the slideshow and so on...

## Complete example
This is where it becomes fun to use this slideshow component and also where we can be very, very, creative.

I think the easiest way to show what the slideshow component can do, is by sharing an advanced (complete) example and then you can see for yourself and maybe even tweak it to your own likings:

#### A slideshow with progress-bar, navigation-buttons and html-content:

Each slide in this slideshow has:
- a background image (inline style)
- an h1 element with a title
- a p tag with some text

At the top of the slideshow there is a progress bar showing the progress of each slide.

And to the sides, we have left/right navigation buttons `<` and `>`, which will instantly change to the next/previous slide. The CSS styling controls these buttons in a way that animates them in from the side only when we hover over the slideshow, otherwise hides them.

When you hover over the slideshow container, the slideshow pauses, and resumes when the mouse leaves the slideshow container.

If you click the slideshow container, the slideshow toggles, meaning if it is currently running, a click will stop the slideshow. If it is stopped, the click will restart it.

The HTML markup:

```html
<div class="slideshow">
    <div class="slideshow__items">
        <div class="slideshow__item slideshow__item--padding" style="background-image: url(./images/image01.jpg);">
            <h1 class="slideshow__title">Image 1</h1>
            <p class="slideshow__text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, velit!</p>
        </div>
        <div class="slideshow__item slideshow__item--padding" style="background-image: url(./images/image02.jpg);">
            <h1 class="slideshow__title">Image 2</h1>
            <p class="slideshow__text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, velit!</p>
        </div>
        <div class="slideshow__item slideshow__item--padding" style="background-image: url(./images/image03.jpg);">
            <h1 class="slideshow__title">Image 3</h1>
            <p class="slideshow__text">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa, velit!</p>
        </div>
    </div>
    <nav class="nav">
        <a href="#" class="nav__btn previous" aria-label="Slide image left">
            <svg class="nav__icon" viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>
        </a>
        <a href="#" class="nav__btn next" aria-label="Slide image right">
            <svg class="nav__icon" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>
        </a>
    </nav>
    <div class="progress"></div>
    <div class="pagination"></div>
</div>
```
The CSS:
```css
/* The slideshow */
.slideshow{
    --slideshow-padding: 2em;
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.slideshow__items{
    display: flex;
    height: 100%;
    /* Speed of the slide animation */
    transition: margin-left 800ms;
}

.slideshow__item{
    min-width: 100vw;
    height: 100%;
    box-sizing: border-box;
    background-size: cover;
}

.slideshow__item--padding{
    padding: var(--slideshow-padding);
}

/* Progress display */
.progress{
    position: absolute;
    top: 0;
    height: 5px;
    background-color: rgb(21, 206, 15);
}

/* Navigation buttons */
.nav{
    --slideshow-btn-width: 80px;
    position: absolute;
    top: 0;
    left: calc((var(--slideshow-btn-width) + var(--slideshow-padding)) * -1);
    right: calc((var(--slideshow-btn-width) + var(--slideshow-padding)) * -1);
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
    transition: left 300ms, right 300ms;
}
.nav:hover{
    left: 0;
    right: 0;
}

.nav__btn{
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 150ms;
}
.nav__btn:hover{
    background-color: rgb(241, 241, 241, 0.25);
}
.nav__icon{
    width: var(--slideshow-btn-width);
    height: var(--slideshow-btn-width);
    fill: rgb(221, 221, 221);
}

/* Pagination */
.pagination{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1em 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.pagination__bullet{
    width: 20px;
    height: 20px;
    border: 1px solid black;
    border-radius: 50%;
    margin: 0.4em;
    background-color: white;
    cursor: pointer;
}
.pagination__bullet:hover{
    background-color: rgb(199, 255, 192);
}
.pagination__bullet.selected{
    background-color: rgb(59, 224, 37);
}
```
And JavaScript:
```javascript
import slideshow from "https://unpkg.com/@bqardi/slideshow";

// Put the HTML elements in variables:
var slideshowElement = document.querySelector(".slideshow");
var itemContainer = slideshowElement.querySelector(".slideshow__items");
var items = slideshowElement.querySelectorAll(".slideshow__item");
var previousBtn = slideshowElement.querySelector(".previous");
var nextBtn = slideshowElement.querySelector(".next");
var progressElement = document.querySelector(".progress");

// Options
var options = {
    // 9s between each slide
    interval: 9000,
    // Call update method every 0.01s
    threshold: 0.01
}

// Slideshow setup:
slideshow.setup(items.length, function(index){
    // This executes on every slide change
    itemContainer.style.marginLeft = index.current * -100 + "vw";
    setBulletActive(index.current); //From pagination below
}, options);

// Pagination
var paginationBullets = [];

items.forEach((item, index) => {
    // Dynamically create bullets for each slide in the slideshow
    var bullet = createBullet(index);
    if (paginationBullets.length === 0) {
        bullet.classList.add("selected");
    }
    paginationBullets.push(bullet);
});

// Adds 'selected' class to bullet matching index from slideshow
function setBulletActive(index){
    for (let i = 0; i < paginationBullets.length; i++) {
        if (i === index) {
            paginationBullets[i].classList.add("selected");
        } else {
            paginationBullets[i].classList.remove("selected");
        }
    }
}

// Creates bullet with eventListener and appends it to pagination element
function createBullet(index){
    var bullet = document.createElement("a");

    // Set attributes
    bullet.href = "#";
    bullet.setAttribute("aria-label", "Bullet for image " + (index + 1));
    bullet.classList.add("pagination__bullet");

    // EventListener
    bullet.addEventListener("click", function(e){
        e.preventDefault();
        e.stopPropagation();
        slideshow.goto(index);
    });

    // Append to pagination parent element
    pagination.appendChild(bullet);
    
    return bullet;
}

// Pause and resume on mouseenter and mouseleave:
slideshowElement.addEventListener("mouseenter", () => slideshow.pause());
slideshowElement.addEventListener("mouseleave", () => slideshow.resume());

// Toggles the slideshow on click:
slideshowElement.addEventListener("click", (e) => {
    e.preventDefault();
    slideshow.toggle();
});

// Slides to previous slide:
previousBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    slideshow.previous();
});

// Slides to next slide:
nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    slideshow.next();
});

// Show the progress of each slide:
slideshow.update(function(progress){
    progressElement.style.width = progress * 100 + "%";
});

// Start the slideshow:
slideshow.start();
```