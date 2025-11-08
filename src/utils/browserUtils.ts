export class BrowserUtils {
  static init(): void {
    this.addPolyfills();
    this.detectBrowser();
    this.addBrowserSpecificStyles();
  }

  private static addPolyfills(): void {
    if (!window.Promise) {
      console.warn('Promise not supported, loading polyfill...');
    }

    if (!window.fetch) {
      console.warn('Fetch not supported, using XMLHttpRequest fallback...');
    }

    if (!Object.assign) {
      Object.assign = function(target: any, ...sources: any[]) {
        sources.forEach(source => {
          if (source) {
            Object.keys(source).forEach(key => {
              target[key] = source[key];
            });
          }
        });
        return target;
      };
    }
  }

  static detectBrowser(): { name: string; version: string } {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Chrome
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    }
    // Firefox
    else if (userAgent.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    }
    // Safari
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    }
    // Edge
    else if (userAgent.includes('Edg')) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    }
    // IE
    else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browserName = 'Internet Explorer';
      browserVersion = userAgent.match(/(?:MSIE |rv:)(\d+)/)?.[1] || 'Unknown';
    }

    console.log(`Browser detected: ${browserName} ${browserVersion}`);
    document.body.classList.add(`browser-${browserName.toLowerCase().replace(/\s+/g, '-')}`);
    
    return { name: browserName, version: browserVersion };
  }

  private static addBrowserSpecificStyles(): void {
    const browser = this.detectBrowser();
    const style = document.createElement('style');
    style.textContent = `
      /* Firefox specific styles */
      .browser-firefox input[type="file"] {
        padding: 0;
      }
      
      /* Safari specific styles */
      .browser-safari input[type="range"] {
        -webkit-appearance: none;
      }
      
      /* IE specific styles */
      .browser-internet-explorer .flex {
        display: -ms-flexbox;
        display: flex;
      }
      
      /* Edge specific styles */
      .browser-edge input::-ms-clear {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }

  static supports = {
    webAudio: () => !!(window.AudioContext || (window as any).webkitAudioContext),
    fileAPI: () => !!(window.File && window.FileReader && window.FileList && window.Blob),
    localStorage: () => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch {
        return false;
      }
    },
    flexbox: () => {
      const div = document.createElement('div');
      div.style.display = 'flex';
      return div.style.display === 'flex';
    },
    grid: () => {
      const div = document.createElement('div');
      div.style.display = 'grid';
      return div.style.display === 'grid';
    }
  };

  static getCapabilities(): Record<string, boolean> {
    return {
      webAudio: this.supports.webAudio(),
      fileAPI: this.supports.fileAPI(),
      localStorage: this.supports.localStorage(),
      flexbox: this.supports.flexbox(),
      grid: this.supports.grid(),
    };
  }
}
