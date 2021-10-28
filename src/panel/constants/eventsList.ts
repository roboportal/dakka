export interface IEventGroupItem {
  groupName: string
  events: Array<{
    key: string
    title: string
    about: string
    defaultSelected?: boolean
  }>
}

const eventsList: Array<IEventGroupItem> = [
  {
    groupName: 'Common',
    events: [
      {
        key: 'error',
        title: 'error',
        about: 'https://www.w3schools.com/jsref/event_onerror.asp',
      },
      {
        key: 'blur',
        title: 'blur',
        about: 'https://www.w3schools.com/jsref/event_onblur.asp',
        defaultSelected: true,
      },
      {
        key: 'copy',
        title: 'copy',
        about: 'https://www.w3schools.com/jsref/event_oncopy.asp',
        defaultSelected: true,
      },
      {
        key: 'cut',
        title: 'cut',
        about: 'https://www.w3schools.com/jsref/event_oncut.asp',
        defaultSelected: true,
      },
      {
        key: 'paste',
        title: 'paste',
        about: 'https://www.w3schools.com/jsref/event_onpaste.asp',
        defaultSelected: true,
      },
      {
        key: 'focus',
        title: 'focus',
        about: 'https://www.w3schools.com/jsref/event_onfocus.asp',
        defaultSelected: true,
      },
      {
        key: 'focusin',
        title: 'focusin',
        about: 'https://www.w3schools.com/jsref/event_onfocusin.asp',
      },
      {
        key: 'focusout',
        title: 'focusout',
        about: 'https://www.w3schools.com/jsref/event_onfocusout.asp',
      },
      {
        key: 'fullscreenchange',
        title: 'fullscreenchange',
        about: 'https://www.w3schools.com/jsref/event_fullscreenchange.asp',
      },
      {
        key: 'fullscreenerror',
        title: 'fullscreenerror',
        about: 'https://www.w3schools.com/jsref/event_fullscreenerror.asp',
      },

      {
        key: 'load',
        title: 'load',
        about: 'https://www.w3schools.com/jsref/event_onload.asp',
      },
      {
        key: 'message',
        title: 'message',
        about: 'https://www.w3schools.com/jsref/event_onmessage_sse.asp',
      },

      {
        key: 'scroll',
        title: 'scroll',
        about: 'https://www.w3schools.com/jsref/event_onscroll.asp',
        defaultSelected: true,
      },
      {
        key: 'wheel',
        title: 'wheel',
        about: 'https://www.w3schools.com/jsref/event_onwheel.asp',
      },
    ],
  },
  {
    groupName: 'Mouse',
    events: [
      {
        key: 'click',
        title: 'click',
        about: 'https://www.w3schools.com/jsref/event_onclick.asp',
        defaultSelected: true,
      },
      {
        key: 'contextmenu',
        title: 'contextmenu',
        about: 'https://www.w3schools.com/jsref/event_oncontextmenu.asp',
        defaultSelected: true,
      },
      {
        key: 'dblclick',
        title: 'dblclick',
        about: 'https://www.w3schools.com/jsref/event_ondblclick.asp',
        defaultSelected: true,
      },
      {
        key: 'mousedown',
        title: 'mousedown',
        about: 'https://www.w3schools.com/jsref/event_onmousedown.asp',
      },
      {
        key: 'mouseenter',
        title: 'mouseenter',
        about: 'https://www.w3schools.com/jsref/event_onmouseenter.asp',
      },
      {
        key: 'mouseleave',
        title: 'mouseleave',
        about: 'https://www.w3schools.com/jsref/event_onmouseleave.asp',
      },
      {
        key: 'mousemove',
        title: 'mousemove',
        about: 'https://www.w3schools.com/jsref/event_onmousemove.asp',
      },
      {
        key: 'mouseover',
        title: 'mouseover',
        about: 'https://www.w3schools.com/jsref/event_onmouseover.asp',
      },
      {
        key: 'mouseout',
        title: 'mouseout',
        about: 'https://www.w3schools.com/jsref/event_onmouseout.asp',
      },
      {
        key: 'mouseup',
        title: 'mouseup',
        about: 'https://www.w3schools.com/jsref/event_onmouseup.asp',
      },
    ],
  },
  {
    groupName: 'Keyboard',
    events: [
      {
        key: 'keydown',
        title: 'keydown',
        about: 'https://www.w3schools.com/jsref/event_onkeydown.asp',
        defaultSelected: true,
      },
      {
        key: 'keypress',
        title: 'keypress',
        about: 'https://www.w3schools.com/jsref/event_onkeypress.asp',
        defaultSelected: true,
      },
      {
        key: 'keyup',
        title: 'keyup',
        about: 'https://www.w3schools.com/jsref/event_onkeyup.asp',
        defaultSelected: true,
      },
    ],
  },
  {
    groupName: 'Drag',
    events: [
      {
        key: 'drag',
        title: 'drag',
        about: 'https://www.w3schools.com/jsref/event_ondrag.asp',
        defaultSelected: true,
      },
      {
        key: 'dragend',
        title: 'dragend',
        about: 'https://www.w3schools.com/jsref/event_ondragend.asp',
        defaultSelected: true,
      },
      {
        key: 'dragenter',
        title: 'dragenter',
        about: 'https://www.w3schools.com/jsref/event_ondragenter.asp',
        defaultSelected: true,
      },
      {
        key: 'dragleave',
        title: 'dragleave',
        about: 'https://www.w3schools.com/jsref/event_ondragleave.asp',
        defaultSelected: true,
      },
      {
        key: 'dragover',
        title: 'dragover',
        about: 'https://www.w3schools.com/jsref/event_ondragover.asp',
        defaultSelected: true,
      },
      {
        key: 'dragstart',
        title: 'dragstart',
        about: 'https://www.w3schools.com/jsref/event_ondragstart.asp',
        defaultSelected: true,
      },
      {
        key: 'drop',
        title: 'drop',
        about: 'https://www.w3schools.com/jsref/event_ondrop.asp',
        defaultSelected: true,
      },
    ],
  },
  {
    groupName: 'Document',
    events: [
      {
        key: 'unload',
        title: 'unload',
        about: 'https://www.w3schools.com/jsref/event_onunload.asp',
      },
      {
        key: 'beforeunload',
        title: 'beforeunload',
        about: 'https://www.w3schools.com/jsref/event_onbeforeunload.asp',
      },
      {
        key: 'pagehide',
        title: 'pagehide',
        about: 'https://www.w3schools.com/jsref/event_onpagehide.asp',
      },
      {
        key: 'resize',
        title: 'resize',
        about: 'https://www.w3schools.com/jsref/event_onresize.asp',
        defaultSelected: true,
      },
      {
        key: 'hashchange',
        title: 'hashchange',
        about: 'https://www.w3schools.com/jsref/event_onhashchange.asp',
      },
      {
        key: 'offline',
        title: 'offline',
        about: 'https://www.w3schools.com/jsref/event_onoffline.asp',
      },
      {
        key: 'online',
        title: 'online',
        about: 'https://www.w3schools.com/jsref/event_ononline.asp',
      },

      {
        key: 'pageshow',
        title: 'pageshow',
        about: 'https://www.w3schools.com/jsref/event_onpageshow.asp',
      },
    ],
  },
  {
    groupName: 'Input',
    events: [
      {
        key: 'search',
        title: 'search',
        about: 'https://www.w3schools.com/jsref/event_onsearch.asp',
        defaultSelected: true,
      },
      {
        key: 'change',
        title: 'change',
        about: 'https://www.w3schools.com/jsref/event_onchange.asp',
        defaultSelected: true,
      },
      {
        key: 'input',
        title: 'input',
        about: 'https://www.w3schools.com/jsref/event_oninput.asp',
        defaultSelected: true,
      },
      {
        key: 'invalid',
        title: 'invalid',
        about: 'https://www.w3schools.com/jsref/event_oninvalid.asp',
        defaultSelected: true,
      },
      {
        key: 'select',
        title: 'select',
        about: 'https://www.w3schools.com/jsref/event_onselect.asp',
        defaultSelected: true,
      },
    ],
  },
  {
    groupName: 'Form',
    events: [
      {
        key: 'reset',
        title: 'reset',
        about: 'https://www.w3schools.com/jsref/event_onreset.asp',
        defaultSelected: true,
      },
      {
        key: 'submit',
        title: 'submit',
        about: 'https://www.w3schools.com/jsref/event_onsubmit.asp',
        defaultSelected: true,
      },
    ],
  },
  {
    groupName: 'Media',
    events: [
      {
        key: 'abort',
        title: 'abort',
        about: 'https://www.w3schools.com/jsref/event_onabort_media.asp',
      },
      {
        key: 'canplay',
        title: 'canplay',
        about: 'https://www.w3schools.com/jsref/event_oncanplay.asp',
      },
      {
        key: 'canplaythrough',
        title: 'canplaythrough',
        about: 'https://www.w3schools.com/jsref/event_oncanplaythrough.asp',
      },
      {
        key: 'durationchange',
        title: 'durationchange',
        about: 'https://www.w3schools.com/jsref/event_ondurationchange.asp',
      },
      {
        key: 'ended',
        title: 'ended',
        about: 'https://www.w3schools.com/jsref/event_onended.asp',
        defaultSelected: true,
      },
      {
        key: 'loadeddata',
        title: 'loadeddata',
        about: 'https://www.w3schools.com/jsref/event_onloadeddata.asp',
      },
      {
        key: 'loadedmetadata',
        title: 'loadedmetadata',
        about: 'https://www.w3schools.com/jsref/event_onloadedmetadata.asp',
      },
      {
        key: 'loadstart',
        title: 'loadstart',
        about: 'https://www.w3schools.com/jsref/event_onloadstart.asp',
      },
      {
        key: 'pause',
        title: 'pause',
        about: 'https://www.w3schools.com/jsref/event_onpause.asp',
        defaultSelected: true,
      },
      {
        key: 'play',
        title: 'play',
        about: 'https://www.w3schools.com/jsref/event_onplay.asp',
        defaultSelected: true,
      },
      {
        key: 'playing',
        title: 'playing',
        about: 'https://www.w3schools.com/jsref/event_onplaying.asp',
      },
      {
        key: 'progress',
        title: 'progress',
        about: 'https://www.w3schools.com/jsref/event_onprogress.asp',
      },
      {
        key: 'ratechange',
        title: 'ratechange',
        about: 'https://www.w3schools.com/jsref/event_onratechange.asp',
      },
      {
        key: 'seeked',
        title: 'seeked',
        about: 'https://www.w3schools.com/jsref/event_onseeked.asp',
      },
      {
        key: 'seeking',
        title: 'seeking',
        about: 'https://www.w3schools.com/jsref/event_onseeking.asp',
      },
      {
        key: 'stalled',
        title: 'stalled',
        about: 'https://www.w3schools.com/jsref/event_onstalled.asp',
      },
      {
        key: 'suspend',
        title: 'suspend',
        about: 'https://www.w3schools.com/jsref/event_onsuspend.asp',
      },
      {
        key: 'timeupdate',
        title: 'timeupdate',
        about: 'https://www.w3schools.com/jsref/event_ontimeupdate.asp',
      },
      {
        key: 'volumechange',
        title: 'volumechange',
        about: 'https://www.w3schools.com/jsref/event_onvolumechange.asp',
      },
      {
        key: 'waiting',
        title: 'waiting',
        about: 'https://www.w3schools.com/jsref/event_onwaiting.asp',
      },
    ],
  },
  {
    groupName: 'Animation',
    events: [
      {
        key: 'animationend',
        title: 'animationend',
        about: 'https://www.w3schools.com/jsref/event_animationend.asp',
      },
      {
        key: 'animationiteration',
        title: 'animationiteration',
        about: 'https://www.w3schools.com/jsref/event_animationiteration.asp',
      },
      {
        key: 'animationstart',
        title: 'animationstart',
        about: 'https://www.w3schools.com/jsref/event_animationstart.asp',
      },
      {
        key: 'transitionend',
        title: 'transitionend',
        about: 'https://www.w3schools.com/jsref/event_transitionend.asp',
      },
    ],
  },
  {
    groupName: 'Touch',
    events: [
      {
        key: 'touchcancel',
        title: 'touchcancel',
        about: 'https://www.w3schools.com/jsref/event_touchcancel.asp',
        defaultSelected: true,
      },
      {
        key: 'touchend',
        title: 'touchend',
        about: 'https://www.w3schools.com/jsref/event_touchend.asp',
        defaultSelected: true,
      },
      {
        key: 'touchmove',
        title: 'touchmove',
        about: 'https://www.w3schools.com/jsref/event_touchmove.asp',
        defaultSelected: true,
      },
      {
        key: 'touchstart',
        title: 'touchstart',
        about: 'https://www.w3schools.com/jsref/event_touchstart.asp',
        defaultSelected: true,
      },
    ],
  },
  {
    groupName: 'Printing',
    events: [
      {
        key: 'afterprint',
        title: 'afterprint',
        about: 'https://www.w3schools.com/jsref/event_onafterprint.asp',
      },
      {
        key: 'beforeprint',
        title: 'beforeprint',
        about: 'https://www.w3schools.com/jsref/event_onbeforeprint.asp',
      },
    ],
  },
  {
    groupName: 'Menu',
    events: [
      {
        key: 'show',
        title: 'show',
        about: 'https://www.w3schools.com/jsref/event_onshow.asp',
      },
    ],
  },
  {
    groupName: 'Details',
    events: [
      {
        key: 'toggle',
        title: 'toggle',
        about: 'https://www.w3schools.com/jsref/event_ontoggle.asp',
      },
    ],
  },
]

export default eventsList
