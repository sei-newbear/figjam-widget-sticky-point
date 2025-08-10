# Sticky Point widget Specification

## Tagline
Apply customizable point tags to sticky notes and count them up.

## Description
Sticky Point offers a versatile way to enhance your FigJam experience by allowing you to add and manage "Point" tags on sticky notes.

It has two main modes:

**Tagging Mode**
In this mode, you can attach fully customizable Point tags to sticky notes, adjusting their size and color to prioritize tasks, indicate effort, or categorize ideas. The widget is "stickable," meaning it attaches to objects like sticky notes and is automatically deleted if its host is removed. For greater stability, you can enable the **Grouping** toggle in the property panel. This locks the Point Widget to its host, treating them as a single unit and preventing unexpected movement when using FigJam's alignment and distribution tools.

**Counting Mode**
When you need to summarize your points, switch to this mode. Simply select the area with the Point tags you want to count, then click the "Count" button. Sticky Point will instantly calculate and display the total of all Point tags. For a deeper analysis, you can click 'Show details' to see a breakdown of the count by point value. This provides quick insights and helps you make informed decisions.

Additionally, Counting Mode now offers a **Compact Mode** for a more streamlined view, displaying only the total points and a refresh button. The `Count Target` property allows you to choose between `Manual Selection` and `Containing Section`. When `Containing Section` is selected, pressing the 'Count' button will **automatically count all Point widgets within the section it is placed in**. When `Manual Selection` is chosen, it counts the currently selected Point widgets. If no Point widgets are explicitly selected and the Counter Widget is within a FigJam Section, pressing the 'Count' button will **automatically count all Point widgets within that section** for convenience. The widget also provides clear feedback on the current selection scope (e.g., counting within a specific section or manual selection).

**Organizing Mode**
This mode allows you to efficiently manage the grouping of selected Point Widgets. It provides dedicated buttons to either **Group** or **Ungroup** selected Point Widgets. The operation specifically targets Point Widgets that are attached to a host, and its grouping/ungrouping logic mirrors the behavior of the Point Widget's built-in auto-grouping feature.

**Sticky Tagger Mode**
This mode introduces a powerful workflow for rapidly applying points to multiple sticky notes. It allows you to create a palette of pre-configured "Point" widgets (tags) that can be quickly applied.

- **Tag Palette**: You can register any existing "Point" widget from your board as a "tag" in the Sticky Tagger's palette. This saves the point value, color, and size of the original widget as a reusable template.
- **Apply Tags**: After building your palette, simply select one or more sticky notes on the board and click a tag from the palette. A copy of the template widget will be instantly attached to each selected sticky note.
- **Bulk Deletion**: The tool also helps with cleanup. You can select a group of objects and use the bulk delete feature to remove all "Point" widgets within that selection. To prevent accidental loss of your templates, any widget registered in the palette will be automatically skipped during deletion. 
