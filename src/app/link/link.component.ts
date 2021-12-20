import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { ElementCoordinates } from '../models/mapping.model'
import { DIST, SERVER_HEIGHT, SERVER_WIDTH } from '../constants/constants'
import { Link, Server, Step } from '../models/documentation.model'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Store } from '@ngrx/store'
import { DocumentationState } from '../stores/documentation.state'
import { selectActiveSteps } from '../stores/scenario/scenario.selector'
import { selectAllServers } from '../stores/server/servers.selector'

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit, OnChanges {
  @Input() link: Link;
  @Output() onHighlightEndpoint = new EventEmitter<Step>();

  public origin: ElementCoordinates;
  public width: number;
  public height: number;
  public activeStep: Step;

  public activeSteps$: Observable<Step[]>;

  constructor (private store: Store<DocumentationState>) {
    this.activeSteps$ = this.store.select(selectActiveSteps)
  }

  ngOnInit (): void {
  }

  ngOnChanges (): void {
    this.setDimensions()
  }

  get endX (): number {
    const width = 155

    switch (this.getDiagonale(this.link.from, this.link.to)) {
      case 'hb':
      case 'bh':
      case 'hdbg':
      case 'bdhg':
      case 'dbgh':
        return this.origin.x - width
      case 'dg':
      case 'dhgb':
        return this.origin.x - width + 9
      case 'gd':
      case 'ghdb':
        return this.origin.x + this.width - width - 10
      case 'bghd':
      case 'hgbd':
        return this.origin.x + this.width - width
    }
    return 0
  }

  get endY (): number {
    switch (this.getDiagonale(this.link.from, this.link.to)) {
      case 'gd':
      case 'dg':
        return this.origin.y - 5
      case 'bghd':
      case 'bdhg':
      case 'dbgh':
      case 'bh':
        return this.origin.y
      case 'hdbg':
      case 'hgbd':
      case 'hb':
        return this.origin.y + this.height - 20
      case 'ghdb':
      case 'dhgb':
        return this.origin.y + this.height - 6
    }
    return 0
  }

  get rotate90 (): boolean {
    switch (this.getDiagonale(this.link.from, this.link.to)) {
      case 'gd':
      case 'ghdb':
      case 'gbdh':
        return true
    }
    return false
  }

  get rotate270 (): boolean {
    switch (this.getDiagonale(this.link.from, this.link.to)) {
      case 'dg':
      case 'dbgh':
      case 'dhgb':
        return true
    }
    return false
  }

  getActiveStep (steps: Step[]): Step {
    this.activeStep = steps.find((step: Step) =>
      (step?.server === this.link.from.key && step?.request?.target === this.link.to.key) ||
      (step?.server === this.link.to.key && step?.response?.target === this.link.from.key)
    )
    return this.activeStep
  }

  highlightEndpoint (): void {
    this.onHighlightEndpoint.emit(this.activeStep)
  }

  isLinkActive (steps: Step[]): boolean {
    return !!this.getActiveStep(steps)
  }

  getPathDirection (step: Step): string {
    if (['dg', 'bdhg', 'hdbg', 'bh', 'dhgb', 'dbgh'].find((diagonale) => diagonale === this.getDiagonale(this.link.from, this.link.to))) {
      return (step?.request) ? 'path-backward-request' : 'path-forward-response'
    }
    return (step?.request) ? 'path-forward-request' : 'path-backward-response'
  }

  getEndpoint (step: Step): string {
    if (step?.request?.endpoint) {
      return step?.request?.endpoint
    } else {
      return step?.response?.endpoint
    }
  }

  setDimensions (): void {
    switch (this.getDiagonale(this.link.from, this.link.to)) {
      case 'gd':
        this.origin = {
          x: this.link.from.coordinates.x + SERVER_WIDTH,
          y: this.link.from.coordinates.y + SERVER_HEIGHT / 2
        }
        this.width = this.link.to.coordinates.x - this.link.from.coordinates.x - SERVER_WIDTH
        this.height = 4
        break
      case 'dg':
        this.origin = {
          x: this.link.to.coordinates.x + SERVER_WIDTH,
          y: this.link.to.coordinates.y + SERVER_HEIGHT / 2
        }
        this.width = this.link.from.coordinates.x - this.link.to.coordinates.x - SERVER_WIDTH
        this.height = 4
        break
      case 'hb':
        this.origin = {
          x: this.link.from.coordinates.x + SERVER_WIDTH / 2,
          y: this.link.from.coordinates.y + SERVER_HEIGHT
        }
        this.width = 4
        this.height = this.link.to.coordinates.y - this.link.from.coordinates.y - SERVER_HEIGHT
        break
      case 'bh':
        this.origin = {
          x: this.link.to.coordinates.x + SERVER_WIDTH / 2,
          y: this.link.to.coordinates.y + SERVER_HEIGHT
        }
        this.width = 4
        this.height = this.link.from.coordinates.y - this.link.to.coordinates.y - SERVER_HEIGHT
        break
      case 'hgbd':
        this.origin = {
          x: this.link.from.coordinates.x + SERVER_WIDTH / 2,
          y: this.link.from.coordinates.y + SERVER_HEIGHT
        }
        this.width = this.link.to.coordinates.x - this.link.from.coordinates.x
        this.height = this.link.to.coordinates.y - this.link.from.coordinates.y - SERVER_HEIGHT
        break
      case 'bdhg':
        this.origin = {
          x: this.link.to.coordinates.x + SERVER_WIDTH / 2,
          y: this.link.to.coordinates.y + SERVER_HEIGHT
        }
        this.width = this.link.from.coordinates.x - this.link.to.coordinates.x
        this.height = this.link.from.coordinates.y - this.link.to.coordinates.y - SERVER_HEIGHT
        break
      case 'bghd':
        this.origin = {
          x: this.link.from.coordinates.x + SERVER_WIDTH / 2,
          y: this.link.to.coordinates.y + SERVER_HEIGHT
        }
        this.width = this.link.to.coordinates.x - this.link.from.coordinates.x
        this.height = this.link.from.coordinates.y - this.link.to.coordinates.y - SERVER_HEIGHT
        break
      case 'gbdh':
        this.origin = {
          x: this.link.from.coordinates.x + SERVER_WIDTH,
          y: this.link.to.coordinates.y + SERVER_HEIGHT / 2
        }
        this.width = this.link.to.coordinates.x - this.link.from.coordinates.x - SERVER_WIDTH
        this.height = this.link.from.coordinates.y - this.link.to.coordinates.y
        break
      case 'hdbg':
        this.origin = {
          x: this.link.to.coordinates.x + SERVER_WIDTH / 2,
          y: this.link.from.coordinates.y + SERVER_HEIGHT
        }
        this.width = this.link.from.coordinates.x - this.link.to.coordinates.x
        this.height = this.link.to.coordinates.y - this.link.from.coordinates.y - SERVER_HEIGHT
        break
      case 'dhgb':
        this.origin = {
          x: this.link.to.coordinates.x + SERVER_WIDTH,
          y: this.link.from.coordinates.y + SERVER_HEIGHT / 2
        }
        this.width = this.link.from.coordinates.x - this.link.to.coordinates.x - SERVER_WIDTH
        this.height = this.link.to.coordinates.y - this.link.from.coordinates.y
        break
      case 'dbgh':
        this.origin = {
          x: this.link.to.coordinates.x + SERVER_WIDTH,
          y: this.link.to.coordinates.y + SERVER_HEIGHT / 2
        }
        this.width = this.link.from.coordinates.x - this.link.to.coordinates.x - SERVER_WIDTH
        this.height = this.link.from.coordinates.y - this.link.to.coordinates.y
        break
      case 'ghdb':
        this.origin = {
          x: this.link.from.coordinates.x + SERVER_WIDTH,
          y: this.link.from.coordinates.y + SERVER_HEIGHT / 2
        }
        this.width = this.link.to.coordinates.x - this.link.from.coordinates.x - SERVER_WIDTH
        this.height = this.link.to.coordinates.y - this.link.from.coordinates.y
        break
    }
  }

  getDiagonale (element1, element2): string {
    if (element1.coordinates.x === element2.coordinates.x) {
      return element1.coordinates.y > element2.coordinates.y ? 'bh' : 'hb'
    }
    if (element1.coordinates.y === element2.coordinates.y) {
      return element1.coordinates.x > element2.coordinates.x ? 'dg' : 'gd'
    }

    if (
      (element1.coordinates.x < element2.coordinates.x && element1.coordinates.y < element2.coordinates.y) ||
      (element2.coordinates.x < element1.coordinates.x && element2.coordinates.y < element1.coordinates.y)
    ) {
      if (Math.abs(element1.coordinates.x - element2.coordinates.x) > Math.abs(element1.coordinates.y - element2.coordinates.y)) {
        return element1.coordinates.x > element2.coordinates.x ? 'dbgh' : 'ghdb'
      } else {
        return element1.coordinates.x > element2.coordinates.x ? 'bdhg' : 'hgbd'
      }
    } else {
      if (Math.abs(element1.coordinates.x - element2.coordinates.x) > Math.abs(element1.coordinates.y - element2.coordinates.y)) {
        return element1.coordinates.x > element2.coordinates.x ? 'dhgb' : 'gbdh'
      } else {
        return element1.coordinates.x > element2.coordinates.x ? 'hdbg' : 'bghd'
      }
    }
  }

  getPathLink (): string {
    const vector = DIST / 5
    switch (this.getDiagonale(this.link.from, this.link.to)) {
      case 'hb':
      case 'bh':
        return 'M2 0 L 2 ' + this.height
      case 'gd':
      case 'dg':
        return 'M0 2 L ' + (this.width) + ' 2'
      case 'ghdb':
      case 'dbgh':
        return 'M0 2, C' + (vector) + ' 0,' + (this.width / 2) + ' ' + (this.height / 2) +
        ', ' + (this.width / 2) + ' ' + (this.height / 2) +
          ' S ' + (this.width - vector) + ' ' + (this.height) + ', ' + this.width + ' ' + (this.height - 2)
      case 'hgbd':
      case 'bdhg':
        return 'M2 0, C0 ' + (vector) + ',' + this.width / 2 + ' ' + (this.height / 2) +
        ', ' + this.width / 2 + ' ' + (this.height / 2) +
          ' S ' + (this.width) + ' ' + (this.height - vector) + ', ' + (this.width - 2) + ' ' + (this.height)
      case 'gbdh':
      case 'dhgb':
        return 'M0 ' + (this.height - 2) + ', C' + (vector) + ' ' + (this.height) + ',' + (this.width / 2) + ' ' + this.height / 2 +
        ', ' + (this.width / 2) + ' ' + this.height / 2 +
          ' S ' + (this.width - vector) + ' 0, ' + this.width + ' 2'
      case 'bghd':
      case 'hdbg':
        return 'M2 ' + this.height + ', C0 ' + (this.height - vector) + ',' + this.width / 2 + ' ' + (this.height / 2) +
        ', ' + this.width / 2 + ' ' + (this.height / 2) +
          ' S ' + (this.width) + ' ' + (vector) + ', ' + (this.width - 2) + ' 0'
      default:
        return ''
    }
  }
}
