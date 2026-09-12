(() => {
  'use strict';
  const isExam = !!document.getElementById('exoTabContent');
  let pending = false;
  function refresh() {
    pending = false;
    if (isExam) {
      document.querySelectorAll('.tab-pane.active .exoIframe').forEach(frame => {
        // postMessage also works when the pages are opened as local files.
        frame.contentWindow.postMessage({type: 'exercise-layout-refresh'}, '*');
      });
      return;
    }
    if (!document.documentElement.clientHeight) return;
    // Hidden iframes have no usable dimensions; recompute after they are shown.
    document.querySelectorAll('.fitToBottom').forEach(element => {
      if (!element.getClientRects().length) return;
      const box = element.getBoundingClientRect();
      const margin = parseFloat(getComputedStyle(element).marginBottom) || 0;
      const height = Math.max(0, window.innerHeight - box.top - margin);
      element.style.height = height + 'px';
    });
    if (typeof ide !== 'undefined' && typeof ide.resize === 'function') ide.resize();
    document.querySelectorAll('.ace_editor').forEach(element => {
      if (element.env && element.env.editor) element.env.editor.resize(true);
    });
  }
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(refresh);
  }
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  window.addEventListener('message', event => {
    if (event.source === window.parent && event.data?.type === 'exercise-layout-refresh') schedule();
  });
  if (isExam) {
    document.querySelectorAll('.exoIframe').forEach(frame => frame.addEventListener('load', schedule));
    new MutationObserver(schedule).observe(document.getElementById('exoTabContent'), {
      attributes: true, subtree: true, attributeFilter: ['class']
    });
    if (window.jQuery) window.jQuery(document).on('shown.bs.tab', schedule);
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(document.getElementById('mainContainer'));
  }
  schedule();
})();
