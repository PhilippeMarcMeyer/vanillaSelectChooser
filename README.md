## vanillaSelectChooser

when order matters...

takes a select multiple drop down and transforms it into 2 lists : to choose on the left, chosen on the right
Mimics a select multiple selection mod with Ctrl and shift keys
Allows drag and drop
Allow reordering of the chosen items 

![screen shot](https://raw.githubusercontent.com/PhilippeMarcMeyer/vanillaSelectChooser/master/vanillaSelectChooser2.png)

### Demo :

https://philippemarcmeyer.github.io/vanillaSelectChooser/index.html?v=0.37

### Use :

#### Make a select multiple attribute ex : 

```
<select id="brands"> ... </select>
```

#### Instanciate vanillaSelectChooser() :

Example :   

```
let chooser = new vanillaSelectChooser("#brands", 
    {
        minWidth: 180, 
        maxHeight: 400,
        addButtonWidth:50,
        gapBeetween:100
    }
);
```

#### Disposal : You can use 

```
chooser.destroy()
```

to dispose of it

#### Options :
- minWidth : the width of a list, default is 200 (px)
- maxHeight : the max height of lists, where the scroll bars appear, default is 400 (px)
- addButtonWidth : Except on small screens, a button between the 2 columns allows to add several items to the second list, defautl is 60 (px)
- gapBeetween : the space between the 2 lists (should be greater than addButtonWidth) default is 120 (px)
- translations : default is { "available": "Availables", "chosen": "Chosen" }, translate in your own language or change the titles

#### onchange event :
The onchange event is still available on the select

#### Retrieving the results :
Get the results directly in the select :

Example :

```
function getSelectValues() {
    let values = [];
    let options = document.querySelectorAll("#brands option");
    Array.prototype.slice.call(options).forEach(function (x) {
        if (x.hasAttribute("selected")) {
            values.push(x.value);
        }
    });
    return values;
}
```

### History :

v0.37 : IE 11 support

v0.36 : Nice effects

v0.35 : Drag and Drop multiple from left to right column and sorting modified (the dropped element is placed just before le target element)

v0.30 : Sortable by Drag and Drop (new conception)

v0.27 : IE 11 Compatibility :-(

v0.26 : Correcting destroy() function + adding nous options + css changes

v0.25 : Basic touch screen support (no global Add button (">")) and space reduced to 10 px between the columns

v0.20 : Use of ctrl and shift keys to mimic a select + button add

v0.10 : First fully working version

v0.01 : first prototype Work in progress

