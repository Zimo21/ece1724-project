# AI Interaction Record

## Session 1: Bug fix flicking on drag and drop box

### Prompt (you sent to AI)

Currently there is a bug on the main page for the drag and drop box, when I try to drag and drop files into the box, it flickers, and glitches, do you have suggestions on what can cause this?

### AI Response (trimmed)

The flickering is caused by dragLeave handler firing when dragging over child elements inside the drop zone. When the cursor hover over a child component inside the drop zone, it triggers handleDragLeave handler, which sets the isDragging state. the The fix is to check if the drag is actually leaving the container.

### What Your Team Did With It

With AI response we understand that the flicking is cause by the handleDragLeave handler firing when the mouse cursor crosses over a child component inside the drag and drop box. In our page.tsx, the styling of the drag and drop box is based on the isDragging state. Which is set by the event handler. However, we have child components inside the drag and drop box such as the upload icon and text boxes. So in this case we need to check whether the relatedTarget is inside the currentTarget: e.currentTarget.contains(e.relatedTarget). After adding this check the bug is resolved.

## Session 2: Integrating History Drawer in UI and In UI even though the background gradient was visible card wasn't needed help in debugging

### Prompt (you sent to AI)

My App is currently showing just the background gradient, not the card also the History Drawer is invisible.

### AI Response (trimmed if long)

Correct the stacking order (z-index) and remove the empty overlay that is sitting on top of your card.

What is wrong:
The gradient container is absolute and ended up covering the card.
There is an extra empty wrapper that created a full‑screen layer.
The card didn’t have a higher z-index, so it was hidden.

### What Your Team Did With It

- We changed made the recommended code changes.
- Implemented the History changes
- We tried with a few alignments suggested by AI

## Session 3 Designing sharing and access control features

### Prompt (you sent to AI)
In my web app, I have a History panel and a "Shared with me" panel. I want to support file sharing between users. 

What is the best way to design actions like delete, remove, and sharing management? 

### AI Response (trimmed if long)
- Only the file owner should be able to delete files
- Shared users should not delete files, but instead remove the file from their own view
- The sharing relationship should be clearly displayed (e.g., a list of users the file is shared with)
- Each shared user entry can include a remove access action for better control

### What Your Team Did With It
The idea of separating Delete (owner) and Remove (shared user) was very useful and helped us design a clearer permission model. Some suggestions were too general, so we adapted them to fit our UI structure (History panel vs. Shared panel). We implemented:
- Delete in the History panel (owner only)
- Remove in the Shared with me panel (removes from user’s view only)
- A shared user list with per-user remove access in the History panel
- We also refined button labels (e.g., avoiding confusion between delete and remove) to improve usability.
