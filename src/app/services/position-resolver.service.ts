import { Injectable } from '@angular/core'
import { DIST, DRAW_HEIGHT, DRAW_WIDTH, SERVER_HEIGHT, SERVER_WIDTH } from '../constants/constants'
import { Link, Server } from '../models/documentation.model'

@Injectable({
  providedIn: 'root'
})
export class PositionResolverService {
  static positionResolver (elements: Server[], links: Link[]): Server[] {
    if (elements.length === 0) {
      return []
    }
    elements = JSON.parse(JSON.stringify(elements))
    const sortedServers = elements.sort((a, b) => {
      return links.filter((link) => (link.from.name === b.name || link.to.name === b.name)).length - links.filter((link) => (link.from.name === a.name || link.to.name === a.name)).length
    })

    sortedServers.forEach((element) => { element.coordinates = { x: 0, y: 0 } })
    // premier element au centre
    sortedServers[0].coordinates = { x: 500, y: 500 }
    this.placeNeighbors(sortedServers[0], elements, links)
    this.center(sortedServers)
    return sortedServers
  }

  static placeNeighbors (center: Server, servers: Server[], links: Link[]) {
    const neighbors = servers.filter((server) =>
      (
        server.name !== center.name &&
        server.coordinates.x === 0 &&
        links.find((link) =>
          (
            (link.from.name === server.name && link.to.name === center.name) ||
            (link.to.name === server.name && link.from.name === center.name)
          )
        )
      )
    )
    let angle = Math.PI * 2 / neighbors.length

    if (neighbors.length === 3) {
      angle = Math.PI * 2 / (neighbors.length + 1)
    }

    let angleOffset = 0
    if (center.neighbors) {
      angle = Math.PI * 2 / (neighbors.length + center.neighbors.length)
      angleOffset = center.neighbors[0].angle
    }

    neighbors.forEach((element, index) => {
      if (!center.neighbors) {
        center.neighbors = []
      }
      center.neighbors.push({ server: element, angle: angle * (index + 1) })
      if (!element.neighbors) {
        element.neighbors = []
      }
      element.neighbors.push({ server: center, angle: angle * (index + 1) - Math.PI })
      element.coordinates = {
        x: Math.round(center.coordinates.x + Math.cos(angle * (index + 1) + angleOffset) * DIST),
        y: Math.round(center.coordinates.y + Math.sin(angle * (index + 1) + angleOffset) * DIST)
      }
    })
    neighbors.forEach((element) => this.placeNeighbors(element, servers, links))
  }

  static center (elements: Server[]): void {
    const width = DRAW_WIDTH - SERVER_WIDTH
    const height = DRAW_HEIGHT - SERVER_HEIGHT

    let minX = elements.sort((a, b) => a.coordinates.x - b.coordinates.x)
    let offsetX = minX[0].coordinates.x - ((width / 2) - ((minX[minX.length - 1].coordinates.x - minX[0].coordinates.x) / 2))
    let minY = elements.sort((a, b) => a.coordinates.y - b.coordinates.y)
    let offsetY = minY[0].coordinates.y - ((height / 2) - ((minY[minY.length - 1].coordinates.y - minY[0].coordinates.y) / 2))
    elements.forEach((element) => {
      element.coordinates.x -= offsetX
      element.coordinates.y -= offsetY
    })
    // re slide to zero if necessary
    minX = elements.sort((a, b) => a.coordinates.x - b.coordinates.x)
    minY = elements.sort((a, b) => a.coordinates.y - b.coordinates.y)
    offsetX = 0
    offsetY = 0
    if (minX[0].coordinates.x < 0) {
      offsetX = minX[0].coordinates.x
    }
    if (minY[0].coordinates.y < 0) {
      offsetY = minY[0].coordinates.y
    }
    if (offsetY !== 0 || offsetX !== 0) {
      elements.forEach((element) => {
        element.coordinates.x -= offsetX
        element.coordinates.y -= offsetY
      })
    }
  }
}
