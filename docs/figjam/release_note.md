# Release Note

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
