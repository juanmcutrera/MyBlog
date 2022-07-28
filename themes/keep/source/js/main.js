/* global KEEP */



window.addEventListener('DOMContentLoaded', () => {
  
  Prism.plugins.toolbar.registerButton('hello-world', 
  {
    
    text: 'Prueba', // required
    onClick: function (env) { // optional
      alert('This code snippet is written in ' + env.language + '.');
    }

    
  });

  Prism.plugins.toolbar.registerButton('select-code', function(env) {
    var button = document.createElement('button');
    button.innerHTML = 'Select Code';
  
    button.addEventListener('click', function () {
      // Source: http://stackoverflow.com/a/11128179/2757940
      if (document.body.createTextRange) { // ms
        var range = document.body.createTextRange();
        range.moveToElementText(env.element);
        range.select();
      } else if (window.getSelection) { // moz, opera, webkit
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(env.element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  
    return button;
  });

  KEEP.themeInfo = {
    theme: `Keep v${KEEP.theme_config.version}`,
    author: 'XPoet',
    repository: 'https://github.com/XPoet/hexo-theme-keep'
  }

  KEEP.localStorageKey = 'KEEP-THEME-STATUS';

  KEEP.styleStatus = {
    isExpandPageWidth: false,
    isDark: false,
    fontSizeLevel: 0,
    isOpenPageAside: true
  }

  // print theme base info
  KEEP.printThemeInfo = () => {
    console.log(`\n %c ${KEEP.themeInfo.theme} %c ${KEEP.themeInfo.repository} \n`, `color: #fadfa3; background: #333; padding: 5px 0;`, `background: #fadfa3; padding: 5px 0;`);
  }

  // set styleStatus to localStorage
  KEEP.setStyleStatus = () => {
    localStorage.setItem(KEEP.localStorageKey, JSON.stringify(KEEP.styleStatus));
  }

  // get styleStatus from localStorage
  KEEP.getStyleStatus = () => {
    let temp = localStorage.getItem(KEEP.localStorageKey);
    if (temp) {
      temp = JSON.parse(temp);
      for (let key in KEEP.styleStatus) {
        KEEP.styleStatus[key] = temp[key];
      }
      return temp;
    } else {
      return null;
    }
  }

  KEEP.refresh = () => {
    KEEP.initUtils();
    KEEP.initHeaderShrink();
    KEEP.initModeToggle();
    KEEP.initBack2Top();

    if (KEEP.theme_config.local_search.enable === true) {
      KEEP.initLocalSearch();
    }

    if (KEEP.theme_config.code_copy.enable === true) {
      KEEP.initCodeCopy();
    }

    if (KEEP.theme_config.lazyload.enable === true) {
      KEEP.initLazyLoad();
    }
  }

  KEEP.printThemeInfo();
  KEEP.refresh();
});
