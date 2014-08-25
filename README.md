angular-dygraphs
================

AngularJS directive for dygraphs. (http://dygraphs.com/).

This project aims to add to the excellent dygraphs library by adding extra features such as a more functional legend, and LESS styling. 
The styling is designed to align the colours with the bootstrap themes.

Example -:

```
<ng-dygraphs ng-if="graph.data.length"
  data="graph.data"
  options="graph.options"
  legend="graph.legend"
  >
</ng-dygraphs>
```

Installation
============
``
  bower install angular-dygraphs --save
``


Legend
======
The directive adds an external legend (as shown in the directive above). Add the legend in a similar way to the dygraphs series -:
legend[key = {label: "..."}

This sets the label which doesnt have to be the same as the dygraphs label. The dygraphs label needs to be unique or strange things happen.
This option allows any label to be set independant of the axes references within dygraphs.

If the legend is set in this way, the directive will disable the internal dygraphs legend.


Popover
=======
The directive also adds a popover that displays the same information as the dygraphs legend when it displays value data except it is displayed next to the mouse pointer.
