import { Injectable } from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  public appDrawer: any;
  public currentUrl: any;

  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav(): any {
    this.appDrawer.close();
  }

  public openNav(): any {
    this.appDrawer.open();
  }
}
