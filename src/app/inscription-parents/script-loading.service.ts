import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoadingService {
  constructor(private zone: NgZone) {}

  registerScript(
    url: string,
    variable: string,
    loaded: (variable: any) => void
  ): void {
    const existingVariable = (window as any)[variable];
    if (existingVariable) {
      this.zone.run(() => {
        loaded(existingVariable);
      });
      return;
    }

    const scriptElement = document.createElement('script');
    scriptElement.id = `payment-script-${variable}`;
    scriptElement.innerHTML = '';
    scriptElement.onload = () => {
      this.zone.run(() => {
        loaded((window as any)[variable]);
      });
    };
    scriptElement.src = url;
    scriptElement.async = true;
    scriptElement.defer = true;

    document.getElementsByTagName('head')[0].appendChild(scriptElement);
  }
}
