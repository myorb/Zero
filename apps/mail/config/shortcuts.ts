import { z } from 'zod';
import { keyboardLayoutMapper } from '../utils/keyboard-layout-map';
import { getKeyCodeFromKey } from '../utils/keyboard-utils';

export const shortcutSchema = z.object({
  keys: z.array(z.string()),
  action: z.string(),
  type: z.enum(['single', 'combination']),
  description: z.string(),
  scope: z.string(),
  preventDefault: z.boolean().optional(),
  ignore: z.boolean().optional(),
});

export type Shortcut = z.infer<typeof shortcutSchema>;
export type ShortcutType = Shortcut['type'];

/**
 * Enhanced shortcut type with keyboard layout mapping support
 */
export interface EnhancedShortcut extends Shortcut {
  mappedKeys?: string[];
  displayKeys?: string[];
}

/**
 * Convert key codes to user-friendly display keys using keyboard layout mapping
 */
export function getDisplayKeysForShortcut(shortcut: Shortcut): string[] {
  const detectedLayout = keyboardLayoutMapper.getDetectedLayout();
  
  return shortcut.keys.map(key => {
    // Handle special modifiers first
    switch (key.toLowerCase()) {
      case 'mod':
        return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
      case 'meta':
        return '⌘';
      case 'ctrl':
      case 'control':
        return 'Ctrl';
      case 'alt':
        return navigator.platform.includes('Mac') ? '⌥' : 'Alt';
      case 'shift':
        return '⇧';
      case 'escape':
        return 'Esc';
      case 'backspace':
        return '⌫';
      case 'enter':
        return '↵';
      case 'space':
        return 'Space';
      default:
        // Use enhanced keyboard layout mapping
        if (detectedLayout?.layout && detectedLayout.layout !== 'qwerty') {
          const keyCode = getKeyCodeFromKey(key);
          const mappedKey = keyboardLayoutMapper.getKeyForCode(keyCode);
          return mappedKey.length === 1 ? mappedKey.toUpperCase() : mappedKey;
        }
        return key.length === 1 ? key.toUpperCase() : key;
    }
  });
}

/**
 * Convert a key string to its corresponding KeyCode
 */


/**
 * Enhance shortcuts with keyboard layout mapping
 */
export function enhanceShortcutsWithMapping(shortcuts: Shortcut[]): EnhancedShortcut[] {
  return shortcuts.map(shortcut => ({
    ...shortcut,
    displayKeys: getDisplayKeysForShortcut(shortcut),
    mappedKeys: keyboardLayoutMapper.mapKeys(shortcut.keys.map(getKeyCodeFromKey)),
  }));
}

const threadDisplayShortcuts: Shortcut[] = [
  // {
  //   keys: ['i'],
  //   action: 'viewEmailDetails',
  //   type: 'single',
  //   description: 'View email details',
  //   scope: 'thread-display',
  // },
  // {
  //   keys: ['mod', 'p'],
  //   action: 'printEmail',
  //   type: 'combination',
  //   description: 'Print email',
  //   scope: 'thread-display',
  // },
  {
    keys: ['r'],
    action: 'reply',
    type: 'single',
    description: 'Reply to email',
    scope: 'thread-display',
  },
  {
    keys: ['a'],
    action: 'replyAll',
    type: 'single',
    description: 'Reply all',
    scope: 'thread-display',
  },
  {
    keys: ['f'],
    action: 'forward',
    type: 'single',
    description: 'Forward email',
    scope: 'thread-display',
  },
  {
    keys: ['meta', 'backspace'],
    action: 'delete',
    type: 'single',
    description: 'Move to Bin',
    scope: 'thread-display',
  },
];

const navigation: Shortcut[] = [
  {
    keys: ['g', 'd'],
    action: 'goToDrafts',
    type: 'combination',
    description: 'Go to drafts',
    scope: 'navigation',
  },
  {
    keys: ['g', 'i'],
    action: 'inbox',
    type: 'combination',
    description: 'Go to inbox',
    scope: 'navigation',
  },
  {
    keys: ['g', 't'],
    action: 'sentMail',
    type: 'combination',
    description: 'Go to sent mail',
    scope: 'navigation',
  },
  {
    keys: ['g', 's'],
    action: 'goToSettings',
    type: 'combination',
    description: 'Go to general settings',
    scope: 'navigation',
  },
  {
    keys: ['g', 'a'],
    action: 'goToArchive',
    type: 'combination',
    description: 'Go to archive',
    scope: 'navigation',
  },
  {
    keys: ['g', 'b'],
    action: 'goToBin',
    type: 'combination',
    description: 'Go to bin',
    scope: 'navigation',
  },
  {
    keys: ['?', 'shift'],
    action: 'helpWithShortcuts',
    type: 'combination',
    description: 'Show keyboard shortcuts',
    scope: 'navigation',
  },
];

const globalShortcuts: Shortcut[] = [
  // {
  //   keys: ['?'],
  //   action: 'helpWithShortcuts',
  //   type: 'single',
  //   description: 'Show keyboard shortcuts',
  //   scope: 'global',
  // },
  {
    keys: ['mod', 'z'],
    action: 'undoLastAction',
    type: 'single',
    description: 'Undo last action',
    scope: 'global',
    preventDefault: true,
  },
  {
    keys: ['v'],
    action: 'openVoice',
    type: 'single',
    description: 'Open voice',
    scope: 'global',
  },
  {
    keys: ['c'],
    action: 'newEmail',
    type: 'single',
    description: 'Compose new email',
    scope: 'global',
    preventDefault: true,
  },
  {
    keys: ['mod', 'k'],
    action: 'commandPalette',
    type: 'combination',
    description: 'Open command palette',
    scope: 'global',
  },
  {
    keys: ['mod', 'shift', 'f'],
    action: 'clearAllFilters',
    type: 'combination',
    description: 'Clear all filters',
    scope: 'global',
    preventDefault: true,
  },
];

const mailListShortcuts: Shortcut[] = [
  {
    keys: ['r'],
    action: 'markAsRead',
    type: 'single',
    description: 'Mark as read',
    scope: 'mail-list',
  },
  {
    keys: ['u'],
    action: 'markAsUnread',
    type: 'single',
    description: 'Mark as unread',
    scope: 'mail-list',
  },
  {
    keys: ['i'],
    action: 'markAsImportant',
    type: 'single',
    description: 'Mark as important',
    scope: 'mail-list',
  },
  {
    keys: ['a'],
    action: 'bulkArchive',
    type: 'single',
    description: 'Bulk archive',
    scope: 'mail-list',
  },
  {
    keys: ['d'],
    action: 'bulkDelete',
    type: 'single',
    description: 'Bulk delete',
    scope: 'mail-list',
  },
  {
    keys: ['s'],
    action: 'bulkStar',
    type: 'single',
    description: 'Bulk star',
    scope: 'mail-list',
  },
  // {
  //   keys: ['u'],
  //   action: 'bulkUnstar',
  //   type: 'single',
  //   description: 'Bulk unstar',
  //   scope: 'mail-list',
  // },
  // {
  //   keys: [''],
  //   action: 'exitSelectionMode',
  //   type: 'single',
  //   description: 'Exit selection mode',
  //   scope: 'mail-list',
  // },
  // {
  //   keys: ['m'],
  //   action: 'muteThread',
  //   type: 'single',
  //   description: 'Mute thread',
  //   scope: 'mail-list',
  // },
  {
    keys: ['e'],
    action: 'archiveEmail',
    type: 'single',
    description: 'Archive email',
    scope: 'mail-list',
  },
  {
    keys: ['escape'],
    action: 'exitSelectionMode',
    type: 'single',
    description: 'Exit selection mode',
    scope: 'mail-list',
  },
  // {
  //   keys: ['!'],
  //   action: 'markAsSpam',
  //   type: 'single',
  //   description: 'Mark as spam',
  //   scope: 'mail-list',
  // },
  // {
  //   keys: ['v'],
  //   action: 'moveToFolder',
  //   type: 'single',
  //   description: 'Move to folder',
  //   scope: 'mail-list',
  // },

  // {
  //   keys: ['o'],
  //   action: 'expandEmailView',
  //   type: 'single',
  //   description: 'Expand email view',
  //   scope: 'mail-list',
  // },
  // {
  //   keys: ['#'],
  //   action: 'delete',
  //   type: 'single',
  //   description: 'Delete email',
  //   scope: 'mail-list',
  // },
  {
    keys: ['mod', 'a'],
    action: 'selectAll',
    type: 'combination',
    description: 'Select all emails',
    scope: 'mail-list',
    preventDefault: true,
  },
  // {
  //   keys: ['j'],
  //   action: 'scrollDown',
  //   type: 'single',
  //   description: 'Scroll down',
  //   scope: 'mail-list',
  // },
  // {
  //   keys: ['k'],
  //   action: 'scrollUp',
  //   type: 'single',
  //   description: 'Scroll up',
  //   scope: 'mail-list',
  // },
  {
    keys: ['1'],
    action: 'showImportant',
    type: 'single',
    description: 'Show important',
    scope: 'mail-list',
  },
  {
    keys: ['2'],
    action: 'showAllMail',
    type: 'single',
    description: 'Show all mail',
    scope: 'mail-list',
  },
  {
    keys: ['3'],
    action: 'showPersonal',
    type: 'single',
    description: 'Show personal',
    scope: 'mail-list',
  },
  {
    keys: ['4'],
    action: 'showUpdates',
    type: 'single',
    description: 'Show updates',
    scope: 'mail-list',
  },
  {
    keys: ['5'],
    action: 'showPromotions',
    type: 'single',
    description: 'Show promotions',
    scope: 'mail-list',
  },
  {
    keys: ['6'],
    action: 'showUnread',
    type: 'single',
    description: 'Show unread',
    scope: 'mail-list',
  },
  {
    keys: ['alt', 'shift', 'click'],
    action: 'selectUnderCursor',
    type: 'combination',
    description: 'Select under cursor',
    scope: 'mail-list',
    ignore: true,
  },
];

const composeShortcuts: Shortcut[] = [
  {
    keys: ['mod', 'Enter'],
    action: 'sendEmail',
    type: 'combination',
    description: 'Send email',
    scope: 'compose',
  },
  {
    keys: ['escape'],
    action: 'closeCompose',
    type: 'single',
    description: 'Close compose',
    scope: 'compose',
  },
];

export const keyboardShortcuts: Shortcut[] = [
  ...navigation,
  ...threadDisplayShortcuts,
  ...globalShortcuts,
  ...mailListShortcuts,
  ...composeShortcuts,
];

/**
 * Enhanced keyboard shortcuts with layout mapping
 */
export const enhancedKeyboardShortcuts: EnhancedShortcut[] = enhanceShortcutsWithMapping(keyboardShortcuts);
