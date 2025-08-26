# Sticky Point widget Specification

## Tagline
Apply customizable point tags to sticky notes and count them up.

## Description
Sticky Point offers a versatile way to enhance your FigJam experience by allowing you to add and manage "Point" tags on sticky notes.

It provides four main functionalities:

**Tagging Mode**
In this mode, you can attach fully customizable Point tags to sticky notes, adjusting their size and color to prioritize tasks, indicate effort, or categorize ideas. The widget is "stickable," meaning it attaches to objects like sticky notes and is automatically deleted if its host is removed. For greater stability, you can enable the **Grouping** toggle in the property panel. This locks the Point Widget to its host, treating them as a single unit and preventing unexpected movement when using FigJam's alignment and distribution tools. The auto-grouping feature is also more precise; it prevents accidental ungrouping if the group contains other objects besides the Point Widget and its host, ensuring that complex arrangements are not unintentionally broken.

**Counting Mode**
When you need to summarize your points, switch to this mode. Simply select the area with the Point tags you want to count, then click the "Count" button. Sticky Point will instantly calculate and display the total of all Point tags. For a deeper analysis, you can click 'Show details' to see a breakdown of the count by point value. This provides quick insights and helps you make informed decisions.

Additionally, Counting Mode now offers a **Compact Mode** for a more streamlined view, displaying only the total points and a refresh button. The `Count Target` property allows you to choose between `Manual Selection` and `Containing Section`. When `Containing Section` is selected, pressing the 'Count' button will **automatically count all Point widgets within the section it is placed in**. When `Manual Selection` is chosen, it counts the currently selected Point widgets. As a convenient shortcut, if no Point widgets are explicitly selected and the Counter Widget is within a FigJam Section, pressing the 'Count' button will **automatically count all Point widgets within that section**. This allows for quick totals without requiring manual selection. The widget also provides clear feedback on the current selection scope (e.g., counting within a specific section or manual selection).

**Organizing Mode**
This mode allows you to efficiently manage the grouping of selected Point Widgets. It provides dedicated buttons to either **Group** or **Ungroup** selected Point Widgets. The operation specifically targets Point Widgets that are attached to a host, and its grouping/ungrouping logic mirrors the behavior of the Point Widget's built-in auto-grouping feature.
For more complex scenarios, the mode includes a **Force Ungroup** toggle. When enabled, this option will dissolve the group containing a Point Widget and its host, even if other elements are part of that group. This provides a direct way to break apart complex groupings without having to manually edit them, overriding the default, more cautious ungrouping behavior.

**Sticky Tagger Mode**
This mode introduces a powerful workflow for rapidly applying points to multiple sticky notes. It allows you to create a palette of pre-configured "Point" widgets (tags) that can be quickly applied.
To save canvas space, Sticky Tagger also features a **Compact Mode**. Once you have your tag palette set up, you can switch to this mode, which minimizes the widget to a single icon. This keeps your workspace tidy while keeping the tagger readily accessible.

- **Tag Palette**: You can register any existing "Point" widget from your board as a "template" in the Sticky Tagger's palette. This saves the point value, color, and size of the widget as a reusable template. The tag buttons in the palette dynamically reflect the size (small, medium, or large) of the original widget, providing better visual consistency and making it easier to identify different types of points at a glance. The system intelligently skips exact duplicates based on their properties. Once registered, the original widget can be safely deleted from the canvas as the template is stored independently.
- **Apply Tags**: After building your palette, simply select one or more sticky notes on the board and click a tag from the palette. A copy of the template widget will be instantly attached to each selected sticky note.
- **Bulk Deletion**: The tool also helps with cleanup. You can select a group of objects and use the bulk delete feature to remove all "Point" widgets within that selection. 
