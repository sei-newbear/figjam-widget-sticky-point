# Sticky Point widget Specification

## Tagline
Apply customizable point tags to sticky notes and count them up.

## Description
Sticky Point offers a versatile way to enhance your FigJam experience by allowing you to add and manage "Point" tags on sticky notes.

It has two main modes:

**Tagging Mode**
In this mode, you can easily attach Point tags to any sticky note. These tags are fully customizable, allowing you to adjust their size and color to suit your needs. This is perfect for prioritizing tasks, indicating effort levels, or categorizing ideas visually.
The widget is designed to be "stickable" to other items, and if the host item (like a sticky note) is deleted, the Point tag will be automatically removed as well.

**Counting Mode**
When you need to summarize your points, switch to this mode. Simply select the area with the Point tags you want to count, then click the "Count" button. Sticky Point will instantly calculate and display the total of all Point tags. For a deeper analysis, you can click 'Show details' to see a breakdown of the count by point value. This provides quick insights and helps you make informed decisions.

Additionally, Counting Mode now offers a **Compact Mode** for a more streamlined view, displaying only the total points and a refresh button. The `Count Target` property allows you to choose between `Manual Selection` and `Containing Section`. When `Containing Section` is selected, pressing the 'Count' button will **automatically count all Point widgets within the section it is placed in**. When `Manual Selection` is chosen, it counts the currently selected Point widgets. If no Point widgets are explicitly selected and the Counter Widget is within a FigJam Section, pressing the 'Count' button will **automatically count all Point widgets within that section** for convenience. The widget also provides clear feedback on the current selection scope (e.g., counting within a specific section or manual selection).