# PageLM Studio Design Notes

## Dialogs, Panels & Wizards

### Layout Rules

- All dialogs, panels, and wizards must have a close affordance (X) in the upper right corner.
- Title and action areas must always be visible — only the content area scrolls.
- For panels with pivots, the pivot tabs must always be visible — only the content area of each pivot panel scrolls.

### Button Placement

- **Primary action** (Save, Create, Add): docked to the lower-right corner.
- **Secondary action** (Close, Cancel): to the left of the primary action.
- **Delete action**: docked to the lower-left corner of the dialog/panel.

### Wizard-Specific

- Wizard popups should always have a fixed width and height. The content area should scroll if needed.
- **Next / Create / Add** button: docked to the lower-right corner.
- **Back / Previous** button (when shown): docked to the lower-left corner.
- Step indicator dots: centered at the bottom of the dialog, between the Back and Next buttons.
