export class BrowserUtils {
  static getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Chrome
    if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      const match = userAgent.match(/Chrome\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Firefox
    else if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      const match = userAgent.match(/Firefox\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Safari
    else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      const match = userAgent.match(/Version\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Edge
    else if (userAgent.indexOf('Edge') > -1) {
      browserName = 'Edge';
      const match = userAgent.match(/Edge\/(\d+)/);
      browserVersion = match ? match[1] : 'Unknown';
    }
    // Internet Explorer
    else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
      browserName = 'Internet Explorer';
      const match = userAgent.match(/(MSIE |rv:)(\d+)/);
      browserVersion = match ? match[2] : 'Unknown';
    }

    return { browserName, browserVersion };
  }

  static checkFeatureSupport() {
    return {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      webAudio: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined',
      fileAPI: typeof File !== 'undefined' && typeof FileReader !== 'undefined',
      dragAndDrop: 'draggable' in document.createElement('div'),
      flexbox: CSS.supports('display', 'flex'),
      grid: CSS.supports('display', 'grid'),
      customProperties: CSS.supports('--custom-property', 'value'),
    };
  }

  static addBrowserClasses() {
    const { browserName } = this.getBrowserInfo();
    const bodyClass = document.body.classList;
    
    bodyClass.add(`browser-${browserName.toLowerCase().replace(/\s+/g, '-')}`);
    
    const features = this.checkFeatureSupport();
    Object.entries(features).forEach(([feature, supported]) => {
      bodyClass.add(supported ? `supports-${feature}` : `no-${feature}`);
    });
  }

  static addPolyfills() {
    if (!Array.from) {
      Array.from = function(arrayLike: any) {
        return Array.prototype.slice.call(arrayLike);
      };
    }

    if (!Object.assign) {
      Object.assign = function(target: any, ...sources: any[]) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }
        const to = Object(target);
        for (let index = 0; index < sources.length; index++) {
          const nextSource = sources[index];
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      };
    }

    if (!window.Promise) {
      console.warn('Promise not supported. Consider adding a polyfill.');
    }

    if (!window.fetch) {
      console.warn('Fetch not supported. Consider adding a polyfill.');
    }
  }

  static init() {
    this.addBrowserClasses();
    this.addPolyfills();
    
    if (process.env.NODE_ENV === 'development') {
      const browserInfo = this.getBrowserInfo();
      const features = this.checkFeatureSupport();
      console.log('Browser Info:', browserInfo);
      console.log('Feature Support:', features);
    }
  }
}
