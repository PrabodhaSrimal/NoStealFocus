const Main = imports.ui.main;

class NoStealFocus {
  constructor() {
    this._windowDemandsAttentionId = global.display.connect('window-demands-attention', this._onWindowDemandsAttention.bind(this));
    this._windowMarkedUrgentId = global.display.connect('window-marked-urgent', this._onWindowDemandsAttention.bind(this));
    log("Disabling 'Window Is Ready' Notification");
  }

  _onWindowDemandsAttention(display, window) {
    if (!window || window.has_focus() || window.is_skip_taskbar())
            return;

    Main.activateWindow(window);
  }

  destroy() {
    global.display.disconnect(this._windowDemandsAttentionId);
    global.display.disconnect(this._windowMarkedUrgentId);
    log("Reenabling 'Window Is Ready' Notification");
  }
}

let noStealFocus;
let oldHandler;

function init() {
}

function enable() {
  global.display.disconnect(Main.windowAttentionHandler._windowDemandsAttentionId);
  global.display.disconnect(Main.windowAttentionHandler._windowMarkedUrgentId);
  oldHandler = Main.windowAttentionHandler;

  noStealFocus = new NoStealFocus();

  Main.windowAttentionHandler = noStealFocus;
}

function disable() {
  noStealFocus.destroy();

  oldHandler._windowDemandsAttentionId = global.display.connect('window-demands-attention', oldHandler._onWindowDemandsAttention.bind(oldHandler));
  oldHandler._windowMarkedUrgentId = global.display.connect('window-marked-urgent', oldHandler._onWindowDemandsAttention.bind(oldHandler));

  Main.windowAttentionHandler = oldHandler;
}

