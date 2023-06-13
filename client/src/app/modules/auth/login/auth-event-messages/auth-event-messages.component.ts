import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-event-messages',
  templateUrl: './auth-event-messages.component.html',
  styleUrls: ['./auth-event-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthEventMessagesComponent {
  @Input() message: string;
}
