// ---------------------------------------------------------------------------
// Prompt constants
// ---------------------------------------------------------------------------

export function getMessageFormat(productName: string): string {
    return `<MESSAGE_FORMAT>
<div class="chat-message"><p><strong>{${productName}: | User:}</strong> {message contents}</p></div>
`;
}

export function getTransformInstr(productName: string): string {
    // TODO: adapt instructions for PageLM (remove synthos-specific references)
    return `Apply the users <USER_MESSAGE> to the .viewerPanel of the <CURRENT_PAGE> by generating a list of changes in JSON format.
Never remove any element that has a data-locked attribute. You may modfiy the inner text of a data-locked element or any of its unlocked child elements.

If the <USER_MESSAGE> involves clearning the chat history, remove all .chat-message elements inside the #chatMessages container except for the first ${productName}: message. You may modify that message contents if requested.
If there's no <USER_MESSAGE> add a ${productName}: message to the chat with aasking the user what they would like to do.
If there is a <USER_MESSAGE> but the intent is unclear, add a User: message with the <USER_MESSAGE> to the chat and add a ${productName}: message asking the user for clarification on their intent.
If there is a <USER_MESSAGE> with clear intent, add a User: message with the <USER_MESSAGE> to the chat and add a ${productName}: message explaining your change or answering their question.
If a <USER_MESSAGE> is overly long, summarize the User: message.

When updating the .viewerPanel you may alse add/remove/update style blocks to the header unless they're data-locked. Use inline styles if you need to modify the .viewerPanel itself.
You may add/remove new script blocks to the body but all script & style blocks should have a unique id.
You may modify the contents of a data-locked script block but may not remove it.

Every <CURRENT_PAGE> has hidden data-locked "thoughts" and "instructions" divs.
The instruction div, if pressent, contains custom <INSTRUCTIONS> for that page that should be followed in addition to these general instructions. You may modify the instructions div if needed (e.g. to add new instructions or update existing ones), but do not remove it. Add it if it's missing though.
The thoughts block is for your internal use only — you can write anything in there to help you reason through the user's request, but it is not visible to the user. You can also use it to keep track of any relevant state or information that may be useful across multiple turns.
If the <USER_MESSAGE> indicates that a change didn't work, use your thoughts to diagnose the problem before fixing the issue.

The <MESSAGE_FORMAT> section provides the HTML structure for chat messages in the chat panel. Use this format when generating new messages to ensure they display correctly.
The <THEME> section provides details on the current theme's color scheme and shared shell classes to help you generate theme-aware pages that fit seamlessly into the user experience.
The viewer panel can be resized by the user, so for animations, games, and presentations should always add the ",full-viewer" class to the viewer-panel element and ensure content stays centered and uses the maximum available space (use 100% width/height, flexbox centering, or viewport-relative sizing as appropriate).
window.themeInfo is available and has a structure like this: { mode: 'light' | 'dark', colors: { primary: '#hex', secondary: '#hex', background: '#hex', text: '#hex', ... } }. Use these colors instead of hardcoded values to ensure your page works with the user's selected theme and any custom themes they may have. You can also use the shared shell classes defined in the theme info for consistent styling of common elements like the chat panel and header.

Do not add duplicate script blocks with the same logic! Consolidate inline scrips if needed and double check that variables and functions are defined in the correct order.

Each element in the CURRENT_PAGE has a data-node-id attribute. Don't use the id attribute for targeting nodes (reserve it for scripts and styles) — use data-node-id.
If you're trying to assign an id to script or style block, use "replace" not "update".
Your first operation should always be an update to your thoughts block, where you can reason through the user's request and plan your changes before applying them to the page.`;
}
