import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructionsComponent {
  @Input() Instructions: any;
}
