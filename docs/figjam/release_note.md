# Release Note

## v6
Counter Widget UI Enhancement

This update enhances the user interface of the Counter Widget by adding a visual indicator for the current counting mode.

・ Count Mode Icon: An icon is now displayed on the Counter Widget itself to clearly show whether it's in "Manual Selection" or "Containing Section" mode.

This improvement helps you understand the widget's counting scope at a glance, making the counting process more intuitive.

## v5
Enhanced Counting Control

This update gives you more explicit control over how the Counter Widget calculates totals. A new dropdown menu in the property panel allows
you to select the counting scope.

- Manual Selection: This is the default behavior, where the widget counts the points of the stickies you have manually selected.
- Containing Section: When you place the Counter Widget inside a FigJam Section, this mode will automatically count all Sticky Points within
   that section.

This enhancement provides clearer control over the automatic section counting feature, ensuring you always know what's being counted.

## v4
Counter Widget Enhancements

This update introduces significant improvements to the Counter Widget's functionality and user experience.

1. Compact Mode for Counter Widget

A new "Compact" mode has been added to the Counter Widget. This space-saving design displays only the total points and a refresh button, making it ideal for keeping a running tally without cluttering your board. You can switch between "Normal" and "Compact" modes from the widget's property menu.

2. Automatic Section Counting

The Counter Widget is now smarter! If you place it inside a FigJam Section, it will automatically count all Sticky Points within that section without requiring you to select anything. It also provides feedback on the current selection scope (e.g., counting within a specific section or a manual selection).

3. UI & UX Refinements

- The property menu is now context-aware, showing only relevant options for either the Point Widget or the Counter Widget.
- The overall design of the Counter Widget has been polished for better readability and a cleaner look.

## v3
Feature Update: Auto-deletion of Orphaned Sticky Points

We've improved the Sticky Point widget to automatically remove points when their host object is deleted.

Previously, if an object with a sticky point attached was deleted, the point would remain on the  canvas. This update ensures that any orphaned points are now automatically cleaned up, keeping your  board tidy.

Changes:
   - Implemented a check that triggers when a sticky point is detached from an object.
   - If the host object no longer exists, the sticky point widget will now remove itself.

## v2
Added Point Breakdown Display
・The point aggregation widget can now display a breakdown of how many of each point value are included.
・Clicking "Show details" reveals the count of stickies for each point value, allowing for a more detailed understanding of the team's estimation trends.

## v1
First release.