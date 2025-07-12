# Release Note

## v4
### Counter Widget Enhancements

This update introduces significant improvements to the Counter Widget's functionality and user experience.

**1. Compact Mode for Counter Widget**

A new "Compact" mode has been added to the Counter Widget. This space-saving design displays only the total points and a refresh button, making it ideal for keeping a running tally without cluttering your board. You can switch between "Normal" and "Compact" modes from the widget's property menu.

**2. Automatic Section Counting**

The Counter Widget is now smarter! If you place it inside a FigJam Section, it will automatically count all Sticky Points within that section without requiring you to select anything. It also provides feedback on the current selection scope (e.g., counting within a specific section or a manual selection).

**3. UI & UX Refinements**

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